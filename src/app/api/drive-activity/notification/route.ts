import { postContentToWebhook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
import { db } from "@/lib/db";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const headersList = headers();
  let channelResourceId;

  headersList.forEach((value, key) => {
    if (key == "x-goog-resource-id") {
      channelResourceId = value;
    }
  });

  // WIP: CREDITS
  if (channelResourceId) {
    const user = await db.user.findFirst({
      where: {
        googleResourceId: channelResourceId,
      },
      select: {
        clerkId: true,
        credits: true,
      },
    });

    if ((user && parseInt(user.credits!) > 0) || user?.credits == "Unlimited") {
      const workflow = await db.workflows.findMany({
        where: {
          userId: user.clerkId,
        },
      });

      if (workflow) {
        workflow.map(async (flow) => {
          const flowPath = JSON.parse(flow.flowPath!);
          let current = 0;

          while (current < flowPath.length) {
            if (flowPath[current] == "Discord") {
              const discordMessage = await db.discordWebhook.findFirst({
                where: {
                  userId: flow.userId,
                },
                select: {
                  url: true,
                },
              });

              if (discordMessage) {
                await postContentToWebhook(
                  flow.discordTemplate!,
                  discordMessage.url
                );
                flowPath.splice(flowPath[current], 1);
              }
            }

            if (flowPath[current] == "Slack") {
              const channels = flow.slackChannels.map((channel) => {
                return {
                  label: "",
                  value: channel,
                };
              });

              await postMessageToSlack(
                flow.slackAccessToken!,
                channels,
                flow.slackTemplate!
              );
              flowPath.splice(flowPath[current], 1);
            }

            if (flowPath[current] == "Notion") {
              await onCreateNewPageInDatabase(
                flow.notionDbId!,
                flow.notionAccessToken!,
                JSON.parse(flow.notionTemplate!)
              );
              flowPath.splice(flowPath[current], 1);
            }

            if (flowPath[current] == "Wait") {
                const res = await axios.put("https://api.cron-job.org/jobs", {
                    job: {
                        url: `${process.env.NGROK_URI}/cron/wait?flow_id=${flow.id}`,
                        enabled: "true",
                        schedule: {}
                    }
                })
            }
          }
        });
      }
    }
  }
}
