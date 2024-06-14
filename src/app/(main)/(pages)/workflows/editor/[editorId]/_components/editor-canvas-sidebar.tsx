"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CONNECTIONS, EditorCanvasDefaultCardTypes } from "@/lib/constants";
import { EditorCanvasCardTypes, EditorNodeType } from "@/lib/types";
import { useNodeConnections } from "@/providers/connections-provider";
import { useEditor } from "@/providers/editor-provider";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-helper";
import {
  fetchBotChannels,
  onConnections,
  onDragStart,
} from "@/lib/editor-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RenderConnectionAccordion from "./render-connection-accordion";
import RenderOutputAccordion from "./render-output-accordion";
import { useFuzzieStore } from "@/store";
import { useEffect } from "react";

type Props = {
  nodes: EditorNodeType[];
};

export default function EditorCanvasSidebar({ nodes }: Props) {
  const { state } = useEditor();
  const { nodeConnection } = useNodeConnections();
  const { googleFile, setSlackChannels } = useFuzzieStore();

  useEffect(() => {
    if (state) onConnections(nodeConnection, state, googleFile);
  }, [state]);

  useEffect(() => {
    if (nodeConnection.slackNode.slackAccessToken)
      fetchBotChannels(
        nodeConnection.slackNode.slackAccessToken,
        setSlackChannels
      );
  }, [nodeConnection]);

  return (
    <aside>
      <Tabs defaultValue="actions" className="h-screen overflow-scroll pb-24">
        <TabsList className="bg-transparent">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="actions" className="flex flex-col gap-4 p-4">
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === "Trigger") ||
                (nodes.length && cardType.type === "Action")
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                onDragStart={(e) =>
                  onDragStart(e, cardKey as EditorCanvasCardTypes)
                }
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <EditorCanvasIconHelper
                    type={cardKey as EditorCanvasCardTypes}
                  />
                  <CardTitle className="text-base">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="settings" className="-mt-6">
          <div className="px-2 py-4 text-center text-xl font-bold">
            {state.editor.selectedNode.data.title}
          </div>
          <Accordion type="multiple">
            <AccordionItem value="Options" className="border-y px-2">
              <AccordionTrigger className="!no-underline">
                Account
              </AccordionTrigger>
              <AccordionContent>
                {CONNECTIONS.map((connection) => (
                  <RenderConnectionAccordion
                    key={connection.title}
                    state={state}
                    connection={connection}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Expected Output" className="px-2">
              <AccordionTrigger className="!no-underline">
                Action
              </AccordionTrigger>
              <RenderOutputAccordion
                state={state}
                nodeConnection={nodeConnection}
              />
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
