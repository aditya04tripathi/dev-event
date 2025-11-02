"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateTaskStatus } from "@/actions/validation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updateTaskStatusReduxWrapper } from "@/store/actionWrappers";
import { useAppDispatch } from "@/store/hooks";
import type { ProjectPlan } from "@/types";

interface ProjectBoardsProps {
  projectPlanId: string;
  plan: ProjectPlan;
}

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
    priority: "HIGH" | "MEDIUM" | "LOW";
    tags: string[];
    phaseName: string;
  };
}

function TaskItem({ task }: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing p-3"
    >
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
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Phase: {task.phaseName}</p>
      </div>
    </Card>
  );
}

export function ProjectBoards({ projectPlanId, plan }: ProjectBoardsProps) {
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<"kanban" | "scrum">("kanban");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleStatusChange = async (
    taskId: string,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED",
  ) => {
    const result = await updateTaskStatus(projectPlanId, taskId, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      // Update Redux store with task status change
      updateTaskStatusReduxWrapper(dispatch, taskId, newStatus);
      toast.success("Task status updated");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Extract status from container ID (e.g., "kanban-TODO")
    const overContainerId = over.id.toString();
    const activeContainerId = active.data.current?.containerId;

    if (
      overContainerId.startsWith("kanban-") ||
      overContainerId.startsWith("scrum-")
    ) {
      const newStatus = overContainerId.split("-")[1] as
        | "TODO"
        | "IN_PROGRESS"
        | "DONE"
        | "BLOCKED";
      const taskId = active.id.toString();
      await handleStatusChange(taskId, newStatus);
    } else if (activeContainerId && activeContainerId !== overContainerId) {
      // Task moved between containers
      const newStatus = overContainerId.split("-")[1] as
        | "TODO"
        | "IN_PROGRESS"
        | "DONE"
        | "BLOCKED";
      const taskId = active.id.toString();
      await handleStatusChange(taskId, newStatus);
    }
  };

  const allTasks = plan.phases.flatMap((phase) =>
    phase.tasks.map((task) => ({
      ...task,
      phaseName: phase.name,
      phaseId: phase.id,
      containerId: `container-${task.status}`,
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
              <Card key={status} id={`kanban-${status}`}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {status.replace("_", " ")} ({tasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </SortableContext>
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
      </DndContext>
    );
  }

  // SCRUM View
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
              <Card key={status} id={`scrum-${status}`}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    {status.replace("_", " ")} ({tasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </SortableContext>
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
    </DndContext>
  );
}
