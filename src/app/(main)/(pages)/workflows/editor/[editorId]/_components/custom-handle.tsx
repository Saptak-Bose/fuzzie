import { useEditor } from "@/providers/editor-provider";
import { CSSProperties } from "react";
import { Handle, HandleProps, ReactFlowState } from "reactflow";

type Props = HandleProps & { style?: CSSProperties };

const selector = (s: ReactFlowState) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

export default function CustomHandle(props: Props) {
  const { state } = useEditor();

  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        const sourcesFromHandleInState = state.editor.edges.filter(
          (edge) => edge.source === e.source
        ).length;
        const sourceNode = state.editor.elements.find(
          (node) => node.id === e.source
        );

        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === e.target
        ).length;

        if (targetFromHandleInState === 1) false;
        if (sourceNode?.type === "Condition") true;
        if (sourcesFromHandleInState < 1) true;

        return false;
      }}
      className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
    />
  );
}
