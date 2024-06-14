"use client";

import { postContentToWebhook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import { Button } from "@/components/ui/button";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { Option } from "@/store";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { onCreateNodeTemplate } from "../../../_actions/workflow-connections";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";

type Props = {
  currentService: string;
  nodeConnection: ConnectionProviderProps;
  channels?: Option[];
  setChannels?: (channels: Option[]) => void;
};

export default function ActionButton({
  currentService,
  nodeConnection,
  channels,
  setChannels,
}: Props) {
  const pathname = usePathname();

  const onSendDiscordMessage = useCallback(async () => {
    const res = await postContentToWebhook(
      nodeConnection.discordNode.content,
      nodeConnection.discordNode.webhookURL
    );

    if (res.message == "success") {
      nodeConnection.setDiscordNode((prev: any) => ({
        ...prev,
        content: "",
      }));
    }
  }, [nodeConnection]);

  const onStoreNotionContent = useCallback(async () => {
    const res = await onCreateNewPageInDatabase(
      nodeConnection.notionNode.databaseId,
      nodeConnection.notionNode.accessToken,
      nodeConnection.notionNode.content
    );

    if (res) {
      nodeConnection.setNotionNode((prev: any) => ({
        ...prev,
        content: {
          name: "",
          kind: "",
          type: "",
        },
      }));
    }
  }, [nodeConnection.notionNode]);

  const onStoreSlackContent = useCallback(async () => {
    const res = await postMessageToSlack(
      nodeConnection.slackNode.slackAccessToken,
      channels!,
      nodeConnection.slackNode.content
    );

    if (res.message == "Success") {
      toast.success("Message sent successfully.");
      nodeConnection.setSlackNode((prev: any) => ({
        ...prev,
        content: "",
      }));
      setChannels!([]);
    } else {
      toast.error(res.message);
    }
  }, [nodeConnection.slackNode, channels]);

  const onCreateLocalNodeTemplate = useCallback(async () => {
    if (currentService === "Discord") {
      const res = await onCreateNodeTemplate(
        nodeConnection.discordNode.content,
        currentService,
        pathname.split("/").pop()!
      );

      if (res) {
        toast.message(res);
      }
    }

    if (currentService === "Slack") {
      const res = await onCreateNodeTemplate(
        nodeConnection.slackNode.content,
        currentService,
        pathname.split("/").pop()!,
        channels,
        nodeConnection.slackNode.slackAccessToken
      );

      if (res) {
        toast.message(res);
      }
    }

    if (currentService === "Notion") {
      const res = await onCreateNodeTemplate(
        JSON.stringify(nodeConnection.notionNode.content),
        currentService,
        pathname.split("/").pop()!,
        [],
        nodeConnection.notionNode.accessToken,
        nodeConnection.notionNode.databaseId
      );

      if (res) {
        toast.message(res);
      }
    }
  }, [nodeConnection, channels]);

  const renderActionButton = () => {
    switch (currentService) {
      case "Discord":
        return (
          <>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onSendDiscordMessage}
            >
              Test
            </Button>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onCreateLocalNodeTemplate}
            >
              Save Template
            </Button>
          </>
        );

      case "Notion":
        return (
          <>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onStoreNotionContent}
            >
              Test Message
            </Button>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onCreateLocalNodeTemplate}
            >
              Save Template
            </Button>
          </>
        );

      case "Slack":
        return (
          <>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onStoreSlackContent}
            >
              Send Message
            </Button>
            <Button
              variant="outline"
              className="font-bold text-[#6C47FF] hover:text-[#6C47FF]"
              onClick={onCreateLocalNodeTemplate}
            >
              Save Template
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return renderActionButton();
}
