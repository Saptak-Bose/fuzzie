"use server";

import { db } from "@/lib/db";
import { Option } from "@/store";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getGoogleListener = async () => {
  const { userId } = auth();

  if (userId) {
    const listener = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        googleResourceId: true,
      },
    });

    if (listener) return listener;
  }
};

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  });

  if (published.publish) return "Workflow published.";

  return "Workflow unpublished.";
};

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === "Discord") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        discordTemplate: content,
      },
    });

    if (response) return "Discord template saved.";
  }

  if (type === "Slack") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        slackTemplate: content,
        slackAccessToken: accessToken,
      },
    });

    if (response) {
      const channelList = await db.workflows.findUnique({
        where: {
          id: workflowId,
        },
        select: {
          slackChannels: true,
        },
      });

      if (channelList) {
        const nonDuplicated = channelList.slackChannels.filter(
          (channel) => channel !== channels![0].value
        );

        nonDuplicated!
          .map((channel) => channel)
          .forEach(async (channel) => {
            await db.workflows.update({
              where: {
                id: workflowId,
              },
              data: {
                slackChannels: {
                  push: channel,
                },
              },
            });
          });

        return "Slack template saved.";
      }

      channels!
        .map((channel) => channel.value)
        .forEach(async (channel) => {
          await db.workflows.update({
            where: {
              id: workflowId,
            },
            data: {
              slackChannels: {
                push: channel,
              },
            },
          });
        });

      return "Slack template saved.";
    }
  }

  if (type === "Notion") {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId: notionDbId,
      },
    });

    if (response) return "Notion template saved.";
  }
};

export const onGetWorkflows = async () => {
  const user = await currentUser();

  if (user) {
    const workflow = await db.workflows.findMany({
      where: {
        userId: user.id,
      },
    });

    if (workflow) return workflow;
  }
};

export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await currentUser();

  if (user) {
    const workflow = await db.workflows.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    });

    if (workflow) return { message: "Workflow created." };

    return { message: "Oops! Try again later." };
  }
};
