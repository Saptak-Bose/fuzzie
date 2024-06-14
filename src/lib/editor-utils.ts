import { ConnectionProviderProps } from "@/providers/connections-provider";
import { EditorCanvasCardType } from "./types";
import { EditorState } from "@/providers/editor-provider";
import { getDiscordConnectionUrl } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import {
  getNotionConnection,
  getNotionDatabase,
} from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import {
  getSlackConnection,
  listBotChannels,
} from "@/app/(main)/(pages)/connections/_actions/slack-connection";
import { Option } from "@/store";

export const onDragStart = (e: any, nodeType: EditorCanvasCardType["type"]) => {
  e.dataTransfer.setData("application/reactflow", nodeType);
  e.dataTransfer.effectAllowed = "move";
};

export const onSlackContent = (
  nodeConnection: ConnectionProviderProps,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  nodeConnection.setSlackNode((prev: any) => ({
    ...prev,
    content: e.target.value,
  }));
};

export const onDiscordChange = (
  nodeConnection: ConnectionProviderProps,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  nodeConnection.setDiscordNode((prev: any) => ({
    ...prev,
    content: e.target.value,
  }));
};

export const onContentChange = (
  nodeConnection: ConnectionProviderProps,
  nodeType: string,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (nodeType === "Slack") return onSlackContent(nodeConnection, e);
  else if (nodeType === "Discord") return onDiscordChange(nodeConnection, e);
};

export const onAddTemplateSlack = (
  nodeConnection: ConnectionProviderProps,
  template: string
) => {
  nodeConnection.setSlackNode((prev: any) => ({
    ...prev,
    content: `${prev.content} ${template}`,
  }));
};

export const onAddTemplateDiscord = (
  nodeConnection: ConnectionProviderProps,
  template: string
) => {
  nodeConnection.setDiscordNode((prev: any) => ({
    ...prev,
    content: `${prev.content} ${template}`,
  }));
};

export const isGoogleFileNotEmpty = (file: any): boolean =>
  Object.keys(file).length > 0 && file.kind !== "";

export const onAddTemplate = (
  nodeConnection: ConnectionProviderProps,
  title: string,
  template: string
) => {
  if (title === "Slack") return onAddTemplateSlack(nodeConnection, template);
  else if (title === "Discord")
    return onAddTemplateDiscord(nodeConnection, template);
};

export const onConnections = async (
  nodeConnection: ConnectionProviderProps,
  editorState: EditorState,
  googleFile: any
) => {
  if (editorState.editor.selectedNode.data.title == "Discord") {
    const connection = await getDiscordConnectionUrl();

    if (connection) {
      nodeConnection.setDiscordNode({
        webhookURL: connection.url,
        content: "",
        webhookName: connection.name,
        guildName: connection.guildName,
      });
    }
  }

  if (editorState.editor.selectedNode.data.title == "Notion") {
    const connection = await getNotionConnection();

    if (connection) {
      nodeConnection.setNotionNode({
        accessToken: connection.accessToken,
        databaseId: connection.databaseId,
        workspaceName: connection.workspaceName,
        content: {
          name: googleFile.name,
          kind: googleFile.kind,
          type: googleFile.mimeType,
        },
      });

      if (nodeConnection.notionNode.databaseId !== "") {
        const res = await getNotionDatabase(
          nodeConnection.notionNode.databaseId,
          nodeConnection.notionNode.accessToken
        );

        return res;
      }
    }
  }

  if (editorState.editor.selectedNode.data.title == "Slack") {
    const connection = await getSlackConnection();

    if (connection) {
      nodeConnection.setSlackNode({
        appId: connection.appId,
        authedUserId: connection.authedUserId,
        authedUserToken: connection.authedUserToken,
        slackAccessToken: connection.slackAccessToken,
        botUserId: connection.botUserId,
        teamId: connection.teamId,
        teamName: connection.teamName,
        userId: connection.userId,
        content: "",
      });
    }
  }
};

export const fetchBotChannels = async (
  token: string,
  setSlackChannels: (slackChannels: Option[]) => void
) => {
  await listBotChannels(token)?.then((channels) => setSlackChannels(channels));
};
