import { EditorCanvasCardType } from "./types";

export const onDragStart = (e: any, nodeType: EditorCanvasCardType["type"]) => {
  e.dataTransfer.setData("application/reactflow", nodeType);
  e.dataTransfer.effectAllowed = "move";
};
