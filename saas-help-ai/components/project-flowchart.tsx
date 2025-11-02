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

    // Start node
    nodes.push({
      id: "start",
      type: "start",
      position: { x: 250, y: 0 },
      data: { label: "Project Start" },
    });

    // Process phases
    let yPosition = 100;
    plan.phases.forEach((phase, index) => {
      phaseMap.set(phase.id, index);
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
      yPosition += 150;
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

    // Connect phases based on dependencies
    plan.phases.forEach((phase, index) => {
      if (phase.dependencies.length === 0) {
        // If no dependencies, connect to previous phase or start
        if (index === 0) {
          // Already connected from start
        } else {
          edges.push({
            id: `phase${index - 1}-phase${index}`,
            source: plan.phases[index - 1].id,
            target: phase.id,
            type: "smoothstep",
          });
        }
      } else {
        // Connect based on dependencies
        phase.dependencies.forEach((depId) => {
          edges.push({
            id: `${depId}-${phase.id}`,
            source: depId,
            target: phase.id,
            type: "smoothstep",
          });
        });
      }
    });

    // Connect last phase to end
    if (plan.phases.length > 0) {
      const lastPhase = plan.phases[plan.phases.length - 1];
      edges.push({
        id: `${lastPhase.id}-end`,
        source: lastPhase.id,
        target: "end",
        type: "smoothstep",
      });
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
