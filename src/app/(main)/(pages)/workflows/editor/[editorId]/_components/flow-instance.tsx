"use client";

import { Button } from "@/components/ui/button";
import { useNodeConnections } from "@/providers/connections-provider";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  onCreateNodeEdges,
  onFlowPublish,
} from "../_actions/workflow-connections";

type Props = {
  children: Readonly<React.ReactNode>;
  edges: any[];
  nodes: any[];
};

export default function FlowInstance({ children, edges, nodes }: Props) {
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState([]);
  const { nodeConnection } = useNodeConnections();

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodeEdges(
      pathname.split("/").pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    );

    if (flow) return toast.message(flow.message);
  }, [nodeConnection]);

  const onPublishWorkflow = useCallback(async () => {
    const res = await onFlowPublish(pathname.split("/").pop()!, true);
    if (res) return toast.message(res);
  }, []);

  const onAutomateFlow = async () => {
    const flows: any = [];
    const connectedEdges = edges.map((edge) => edge.target);

    connectedEdges.map((target) => {
      nodes.forEach((node) => {
        if (node.id === target) {
          flows.push(node.type);
        }
      });
    });

    setIsFlow(flows);
  };

  useEffect(() => {
    onAutomateFlow();
  }, [edges]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
          className="hover:bg-[#6C47FF] hover:text-white transform duration-300 font-bold text-primary-foreground hover:font-semibold"
          onClick={onFlowAutomation}
          disabled={isFlow.length < 1}
        >
          Save
        </Button>
        <Button
          className="hover:bg-[#6C47FF] hover:text-white transform duration-300 font-bold text-primary-foreground hover:font-semibold"
          onClick={onPublishWorkflow}
          disabled={isFlow.length < 1}
        >
          Publish
        </Button>
      </div>
      {children}
    </div>
  );
}
