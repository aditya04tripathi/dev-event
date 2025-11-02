"use server";

import type mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  CACHE_TTL,
  FREE_SEARCHES_LIMIT,
  RATE_LIMIT,
  SUBSCRIPTION_TIERS,
} from "@/constants";
import connectDB from "@/lib/db";
import {
  generateAlternativeIdeas,
  generateProjectPlan,
  validateIdea,
} from "@/lib/groq";
import { getCache, rateLimit, setCache } from "@/lib/redis";
import ProjectPlan from "@/models/ProjectPlan";
import User from "@/models/User";
import Validation from "@/models/Validation";
import type { ValidationResult } from "@/types";

export async function validateStartupIdea(idea: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  if (!idea || idea.trim().length < 10) {
    return {
      error: "Please provide a detailed startup idea (at least 10 characters)",
    };
  }

  try {
    await connectDB();

    // Rate limiting
    const rateLimitResult = await rateLimit(
      `validation:${session.user.id}`,
      RATE_LIMIT.VALIDATION.maxRequests,
      RATE_LIMIT.VALIDATION.windowMs
    );

    if (!rateLimitResult.allowed) {
      return {
        error: `Rate limit exceeded. Please try again after ${new Date(
          rateLimitResult.resetAt
        ).toLocaleTimeString()}`,
      };
    }

    // Check search limit
    const user = await User.findById(session.user.id);
    if (!user) {
      return { error: "User not found" };
    }

    const tier = SUBSCRIPTION_TIERS[user.subscriptionTier];
    const now = new Date();

    // Reset counter if needed
    if (now > user.searchesResetAt) {
      user.searchesUsed = 0;
      if (user.subscriptionTier === "FREE") {
        user.searchesResetAt = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
      } else if (user.subscriptionTier === "MONTHLY") {
        user.searchesResetAt = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
      } else if (user.subscriptionTier === "YEARLY") {
        user.searchesResetAt = new Date(
          now.getTime() + 365 * 24 * 60 * 60 * 1000
        );
      }
      await user.save();
    }

    if (
      user.subscriptionTier === "FREE" &&
      user.searchesUsed >= FREE_SEARCHES_LIMIT
    ) {
      return {
        error: "Free tier limit reached",
        upgradeRequired: true,
      };
    }

    if (
      user.searchesUsed >= tier.searchesPerMonth &&
      user.subscriptionTier !== "ONE_OFF"
    ) {
      return {
        error: "Subscription limit reached",
        upgradeRequired: true,
      };
    }

    // Check cache
    const cacheKey = `validation:${Buffer.from(idea)
      .toString("base64")
      .slice(0, 50)}`;
    const cached = await getCache<ValidationResult>(cacheKey);
    if (cached) {
      // Still increment user's search count
      user.searchesUsed += 1;
      await user.save();

      // Create validation record
      const validation = await Validation.create({
        userId: user._id,
        idea,
        validationResult: cached,
      });

      revalidatePath("/dashboard");
      return {
        success: true,
        validationId: (validation._id as mongoose.Types.ObjectId).toString(),
        validationResult: cached,
      };
    }

    // Generate validation
    const validationResult = await validateIdea(idea);

    // Increment search count
    user.searchesUsed += 1;
    await user.save();

    // Save validation
    const validation = await Validation.create({
      userId: user._id,
      idea,
      validationResult,
    });

    // Cache result
    await setCache(cacheKey, validationResult, CACHE_TTL.VALIDATION);

    revalidatePath("/dashboard");
    return {
      success: true,
      validationId: (validation._id as mongoose.Types.ObjectId).toString(),
      validationResult,
    };
  } catch (error) {
    console.error("Validation error:", error);
    return { error: "Failed to validate idea. Please try again." };
  }
}

export async function generatePlan(validationId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const validation = await Validation.findById(validationId);
    if (!validation || validation.userId.toString() !== session.user.id) {
      return { error: "Validation not found" };
    }

    // Check if plan already exists
    let projectPlan = await ProjectPlan.findOne({
      validationId: validation._id,
    });

    if (projectPlan) {
      return {
        success: true,
        projectPlanId: (projectPlan._id as mongoose.Types.ObjectId).toString(),
        plan: projectPlan.plan,
        alternativeIdeas: projectPlan.alternativeIdeas,
      };
    }

    // Generate alternative ideas
    const alternativeIdeas = await generateAlternativeIdeas(validation.idea);

    // Generate project plan
    const plan = await generateProjectPlan(
      validation.idea,
      validation.validationResult
    );

    // Save project plan
    projectPlan = await ProjectPlan.create({
      validationId: validation._id,
      userId: validation.userId,
      plan,
      alternativeIdeas,
    });

    // Update validation with project plan reference
    validation.projectPlanId = projectPlan._id as mongoose.Types.ObjectId;
    await validation.save();

    revalidatePath(
      `/project/${(projectPlan._id as mongoose.Types.ObjectId).toString()}`
    );
    return {
      success: true,
      projectPlanId: (projectPlan._id as mongoose.Types.ObjectId).toString(),
      plan,
      alternativeIdeas,
    };
  } catch (error) {
    console.error("Generate plan error:", error);
    return { error: "Failed to generate project plan. Please try again." };
  }
}

export async function updateTaskStatus(
  projectPlanId: string,
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED"
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    await connectDB();

    const projectPlan = await ProjectPlan.findById(projectPlanId);
    if (!projectPlan || projectPlan.userId.toString() !== session.user.id) {
      return { error: "Project plan not found" };
    }

    // Find and update task
    for (const phase of projectPlan.plan.phases) {
      const task = phase.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
        await projectPlan.save();
        revalidatePath(`/project/${projectPlanId}`);
        return { success: true };
      }
    }

    return { error: "Task not found" };
  } catch (error) {
    console.error("Update task error:", error);
    return { error: "Failed to update task" };
  }
}
