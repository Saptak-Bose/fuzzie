"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type ConnectionProviderProps = {
  discordNode: {
    webhookURL: string;
    content: string;
    webhookName: string;
    guildName: string;
  };
  setDiscordNode: Dispatch<SetStateAction<any>>;
  googleNode: {}[];
  setGoogleNode: Dispatch<SetStateAction<any>>;
  notionNode: {
    accessToken: string;
    databaseId: string;
    workspaceName: string;
    content: "";
  };
  workflowTemplate: {
    discord?: string;
    notion?: string;
    slack?: string;
  };
  setNotionNode: Dispatch<SetStateAction<any>>;
  slackNode: {
    appId: string;
    authedUserId: string;
    authedUserToken: string;
    slackAccessToken: string;
    botUserId: string;
    teamId: string;
    teamName: string;
    content: string;
  };
  setSlackNode: Dispatch<SetStateAction<any>>;
  setWorkFlowTemplate: Dispatch<
    SetStateAction<{
      discord?: string;
      notion?: string;
      slack?: string;
    }>
  >;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

type Props = {
  children: Readonly<React.ReactNode>;
};

const InitialValues: ConnectionProviderProps = {
  discordNode: {
    webhookURL: "",
    content: "",
    webhookName: "",
    guildName: "",
  },
  googleNode: [],
  notionNode: {
    accessToken: "",
    databaseId: "",
    workspaceName: "",
    content: "",
  },
  workflowTemplate: {
    discord: "",
    notion: "",
    slack: "",
  },
  slackNode: {
    appId: "",
    authedUserId: "",
    authedUserToken: "",
    slackAccessToken: "",
    botUserId: "",
    teamId: "",
    teamName: "",
    content: "",
  },
  isLoading: false,
  setGoogleNode: () => undefined,
  setDiscordNode: () => undefined,
  setNotionNode: () => undefined,
  setSlackNode: () => undefined,
  setIsLoading: () => undefined,
  setWorkFlowTemplate: () => undefined,
};

const ConnectionsContext = createContext(InitialValues);

export default function ConnectionsProvider({ children }: Props) {
  const [discordNode, setDiscordNode] = useState(InitialValues.discordNode);
  const [googleNode, setGoogleNode] = useState(InitialValues.googleNode);
  const [notionNode, setNotionNode] = useState(InitialValues.notionNode);
  const [slackNode, setSlackNode] = useState(InitialValues.slackNode);
  const [isLoading, setIsLoading] = useState(InitialValues.isLoading);
  const [workflowTemplate, setWorkFlowTemplate] = useState(
    InitialValues.workflowTemplate
  );

  const values = {
    discordNode,
    setDiscordNode,
    googleNode,
    setGoogleNode,
    notionNode,
    setNotionNode,
    slackNode,
    setSlackNode,
    isLoading,
    setIsLoading,
    workflowTemplate,
    setWorkFlowTemplate,
  };

  return (
    <ConnectionsContext.Provider value={values}>
      {children}
    </ConnectionsContext.Provider>
  );
}

export const useNodeConnections = () => {
  const nodeConnection = useContext(ConnectionsContext);
  return { nodeConnection };
};
