"use client";

import {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  type NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import type { ProjectPlan } from "@/types";

interface ProjectFlowchartProps {
  plan: ProjectPlan;
}

const nodeTypes: NodeTypes = {
  start: ({ data }) => (
    <div className="rounded-lg border-2 border-green-500 bg-green-50 px-4 py-2 text-center dark:bg-green-950">
      <div className="font-semibold text-green-700 dark:text-green-300">
        {data.label}
      </div>
    </div>
  ),
  process: ({ data }) => (
    <div className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-2 text-center dark:bg-blue-950">
      <div className="font-semibold text-blue-700 dark:text-blue-300">
        {data.label}
      </div>
      {data.description && (
        <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          {data.description}
        </div>
      )}
    </div>
  ),
  decision: ({ data }) => (
    <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 px-4 py-2 text-center dark:bg-yellow-950">
      <div className="font-semibold text-yellow-700 dark:text-yellow-300">
        {data.label}
      </div>
      {data.description && (
        <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
          {data.description}
        </div>
      )}
    </div>
  ),
  end: ({ data }) => (
    <div className="rounded-lg border-2 border-red-500 bg-red-50 px-4 py-2 text-center dark:bg-red-950">
      <div className="font-semibold text-red-700 dark:text-red-300">
        {data.label}
      </div>
    </div>
  ),
};

export function ProjectFlowchart({ plan }: ProjectFlowchartProps) {
  const initialNodes = useMemo(() => {
    const nodes: Node[] = [];
    const phaseMap = new Map<string, number>();
    const taskMap = new Map<string, { phaseId: string; index: number }>();

    // Start node
    nodes.push({
      id: "start",
      type: "start",
      position: { x: 250, y: 0 },
      data: { label: "Project Start" },
    });

    // Process phases and tasks
    let yPosition = 100;
    const horizontalSpacing = 300;
    const verticalSpacing = 120;

    plan.phases.forEach((phase, phaseIndex) => {
      phaseMap.set(phase.id, phaseIndex);

      // Phase node
      nodes.push({
        id: phase.id,
        type: "process",
        position: { x: 250, y: yPosition },
        data: {
          label: phase.name,
          description: phase.description,
          phaseId: phase.id,
        },
      });
      yPosition += 80;

      // Task nodes for this phase
      phase.tasks.forEach((task, taskIndex) => {
        const taskId = task.id;
        const xOffset = (taskIndex % 3) * horizontalSpacing - horizontalSpacing;
        const yOffset = Math.floor(taskIndex / 3) * verticalSpacing;

        taskMap.set(taskId, { phaseId: phase.id, index: taskIndex });

        nodes.push({
          id: taskId,
          type: task.status === "DONE" ? "process" : "decision",
          position: {
            x: 250 + xOffset,
            y: yPosition + yOffset,
          },
          data: {
            label: task.title,
            description: `${task.status} - ${task.priority} priority`,
            taskId: task.id,
            phaseId: phase.id,
          },
        });
      });

      yPosition += Math.max(
        Math.ceil(phase.tasks.length / 3) * verticalSpacing,
        80,
      );
    });

    // End node
    nodes.push({
      id: "end",
      type: "end",
      position: { x: 250, y: yPosition },
      data: { label: "Project Complete" },
    });

    return nodes;
  }, [plan.phases]);

  const initialEdges = useMemo(() => {
    const edges: Edge[] = [];

    // Connect start to first phase
    if (plan.phases.length > 0) {
      edges.push({
        id: "start-phase0",
        source: "start",
        target: plan.phases[0].id,
        type: "smoothstep",
      });
    }

    // Connect phases to their tasks and tasks to next phase
    plan.phases.forEach((phase, phaseIndex) => {
      // Connect phase to its first task (or multiple tasks)
      const phaseTasks = phase.tasks.filter(
        (t) =>
          !plan.phases
            .slice(0, phaseIndex)
            .some((p) => p.tasks.some((pt) => pt.id === t.id)),
      );

      if (phaseTasks.length > 0) {
        phaseTasks.slice(0, 1).forEach((task) => {
          edges.push({
            id: `${phase.id}-${task.id}`,
            source: phase.id,
            target: task.id,
            type: "smoothstep",
          });
        });
      }

      // Connect tasks within phase
      phase.tasks.forEach((task, taskIndex) => {
        if (taskIndex < phase.tasks.length - 1) {
          edges.push({
            id: `${task.id}-${phase.tasks[taskIndex + 1].id}`,
            source: task.id,
            target: phase.tasks[taskIndex + 1].id,
            type: "smoothstep",
          });
        }
      });
    });

    // Connect phases based on dependencies
    plan.phases.forEach((phase, index) => {
      if (phase.dependencies.length === 0) {
        if (index === 0) {
          // Already connected from start
        } else {
          const prevPhase = plan.phases[index - 1];
          const prevPhaseLastTask = prevPhase.tasks[prevPhase.tasks.length - 1];
          const currentPhaseFirstTask = phase.tasks[0];

          if (prevPhaseLastTask && currentPhaseFirstTask) {
            edges.push({
              id: `${prevPhaseLastTask.id}-${currentPhaseFirstTask.id}`,
              source: prevPhaseLastTask.id,
              target: currentPhaseFirstTask.id,
              type: "smoothstep",
            });
          }
        }
      } else {
        phase.dependencies.forEach((depId) => {
          const depPhase = plan.phases.find((p) => p.id === depId);
          if (depPhase && depPhase.tasks.length > 0 && phase.tasks.length > 0) {
            edges.push({
              id: `${depPhase.tasks[depPhase.tasks.length - 1].id}-${phase.tasks[0].id}`,
              source: depPhase.tasks[depPhase.tasks.length - 1].id,
              target: phase.tasks[0].id,
              type: "smoothstep",
            });
          }
        });
      }
    });

    // Connect last phase's last task to end
    if (plan.phases.length > 0) {
      const lastPhase = plan.phases[plan.phases.length - 1];
      if (lastPhase.tasks.length > 0) {
        const lastTask = lastPhase.tasks[lastPhase.tasks.length - 1];
        edges.push({
          id: `${lastTask.id}-end`,
          source: lastTask.id,
          target: "end",
          type: "smoothstep",
        });
      }
    }

    return edges;
  }, [plan.phases]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
