"use client";

import { Button } from "@/components/ui/button";
import { EditorNodeType } from "@/lib/types";
import { useNodeConnections } from "@/providers/connections-provider";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { onCreateNodeEdges, onFlowPublish } from "../_actions/workflow-connections";

type Props = {
  children: Readonly<React.ReactNode>;
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
  nodes: EditorNodeType[];
};

export default function FlowInstance({ children, edges, nodes }: Props) {
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState([]);
  const nodeConnection = useNodeConnections();

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodeEdges(
      pathname.split("/").pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    );

    if (flow) toast.message(flow.message);
  }, [nodeConnection]);

  const onPublishWorkflow = useCallback(async () => {
    const res = await onFlowPublish(pathname.split("/").pop()!, true);
    if (res) toast.message(res);
  }, []);

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
