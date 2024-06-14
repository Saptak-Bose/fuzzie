import { AccordionContent } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onContentChange } from "@/lib/editor-utils";
import { nodeMapper } from "@/lib/types";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { EditorState } from "@/providers/editor-provider";
import { Option } from "@/store";
import GoogleFileDetails from "./google-file-details";
import GoogleDriveFiles from "./google-drive-files";
import ActionButton from "./action-button";

type Props = {
  nodeConnection: ConnectionProviderProps;
  newState: EditorState;
  file: any;
  setFile: (file: any) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (value: Option[]) => void;
};

export default function ContentBasedOnTitle({
  file,
  newState,
  nodeConnection,
  selectedSlackChannels,
  setFile,
  setSelectedSlackChannels,
}: Props) {
  const { selectedNode } = newState.editor;
  const title = selectedNode.data.title;
  // @ts-ignore
  const nodeConnectionType: any = nodeConnection[nodeMapper[title]];

  if (!nodeConnectionType) return <p>Not connected.</p>;

  const isConnected =
    title === "Google Drive"
      ? !nodeConnection.isLoading
      : !!nodeConnectionType[
          `${
            title === "Slack"
              ? "slackAccessToken"
              : title === "Discord"
              ? "webhookURL"
              : title === "Notion"
              ? "accessToken"
              : ""
          }`
        ];

  if (!isConnected) return <p>Not connected.</p>;

  return (
    <AccordionContent>
      <Card>
        {title === "Discord" ? (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        ) : null}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === "Notion" ? "Values to be stored" : "Message"}</p>
          {title === "Discord" || title === "Slack" ? (
            <Input
              type="text"
              value={nodeConnectionType.content}
              onChange={(e) => onContentChange(nodeConnection, title, e)}
            />
          ) : null}
          {JSON.stringify(file) !== "{}" && title !== "Google Drive" ? (
            <Card className="w-full">
              <CardContent className="px-2 py-3">
                <div className="flex flex-col gap-4">
                  <CardDescription>Drive File</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <GoogleFileDetails
                      nodeConnection={nodeConnection}
                      title={title}
                      gFile={file}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          {title === "Google Drive" ? <GoogleDriveFiles /> : null}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  );
}
