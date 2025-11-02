"use client";

import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateTaskStatus } from "@/actions/validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ProjectPlan } from "@/types";

interface ProjectBoardsProps {
  projectPlanId: string;
  plan: ProjectPlan;
}

export function ProjectBoards({ projectPlanId, plan }: ProjectBoardsProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "scrum">("kanban");

  const handleStatusChange = async (
    taskId: string,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED",
  ) => {
    const result = await updateTaskStatus(projectPlanId, taskId, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task status updated");
    }
  };

  const allTasks = plan.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseName: phase.name,
      phaseId: phase.id,
    })),
  );

  const tasksByStatus = {
    TODO: allTasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: allTasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: allTasks.filter((t) => t.status === "DONE"),
    BLOCKED: allTasks.filter((t) => t.status === "BLOCKED"),
  };

  if (viewMode === "kanban") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">KANBAN Board</h3>
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as "kanban" | "scrum")}
          >
            <ToggleGroupItem value="kanban" aria-label="KANBAN">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="scrum" aria-label="SCRUM">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {status.replace("_", " ")} ({tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === "HIGH"
                              ? "destructive"
                              : task.priority === "MEDIUM"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Phase: {task.phaseName}
                      </p>
                      <Select
                        value={task.status}
                        onValueChange={(v) =>
                          handleStatusChange(
                            task.id,
                            v as "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED",
                          )
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO">TODO</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            IN PROGRESS
                          </SelectItem>
                          <SelectItem value="DONE">DONE</SelectItem>
                          <SelectItem value="BLOCKED">BLOCKED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No tasks
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // SCRUM View (Sprint-based)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SCRUM Board</h3>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as "kanban" | "scrum")}
        >
          <ToggleGroupItem value="kanban" aria-label="KANBAN">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="scrum" aria-label="SCRUM">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {["TODO", "IN_PROGRESS", "DONE"].map((status) => {
          const tasks = tasksByStatus[status as keyof typeof tasksByStatus];
          return (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {status.replace("_", " ")} ({tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === "HIGH"
                              ? "destructive"
                              : task.priority === "MEDIUM"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Phase: {task.phaseName}
                      </p>
                      <Select
                        value={task.status}
                        onValueChange={(v) =>
                          handleStatusChange(
                            task.id,
                            v as "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED",
                          )
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO">TODO</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            IN PROGRESS
                          </SelectItem>
                          <SelectItem value="DONE">DONE</SelectItem>
                          <SelectItem value="BLOCKED">BLOCKED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No tasks
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {tasksByStatus.BLOCKED.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-destructive">
              BLOCKED ({tasksByStatus.BLOCKED.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksByStatus.BLOCKED.map((task) => (
              <Card key={task.id} className="p-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
