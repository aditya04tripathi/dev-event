"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { validateStartupIdea } from "@/actions/validation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { syncUserToRedux } from "@/store/actionWrappers";
import { useAppDispatch } from "@/store/hooks";

export default function ValidatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idea.trim() || idea.trim().length < 10) {
      toast.error(
        "Please provide a detailed startup idea (at least 10 characters)",
      );
      return;
    }

    setLoading(true);
    try {
      const result = await validateStartupIdea(idea);

      if (result.error) {
        if (result.upgradeRequired) {
          toast.error(result.error, {
            action: {
              label: "Upgrade",
              onClick: () => router.push("/pricing"),
            },
          });
        } else {
          toast.error(result.error);
        }
        return;
      }

      if (result.success && result.validationId) {
        // Update Redux store with user data (searchesUsed)
        if (result.user) {
          syncUserToRedux(dispatch, result.user);
        }
        toast.success("Idea validated successfully!");
        router.push(`/validation/${result.validationId}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl">
              Validate Your Startup Idea
            </CardTitle>
            <CardDescription className="text-base">
              Describe your startup idea and get AI-powered validation with
              detailed feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="idea" className="text-sm font-medium">
                  Your Startup Idea
                </label>
                <Textarea
                  id="idea"
                  placeholder="Describe your startup idea in detail. Include what problem you're solving, your target audience, and how your solution works..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={12}
                  className="resize-none"
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  {idea.length}/1000 characters (minimum 10 characters)
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Validate Idea
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
