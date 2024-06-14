import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {};

export default async function EditorPage({}: Props) {
  const authUser = await currentUser();
  const user = await db.user.findUnique({
    where: {
      clerkId: authUser?.id,
    },
  });

  if (!authUser || !user) return redirect("/sign-in");

  const workflows = await db.workflows.findMany({
    where: {
      userId: authUser.id,
    },
  });

  if (!workflows.length) return redirect("/workflows");
  else return redirect(`/workflows/editor/${workflows[0].id}`);
}
