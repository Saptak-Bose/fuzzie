import ProfileForm from "@/components/forms/profile-form";
import ProfilePicture from "./_components/profile-picture";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

type Props = {};

export default async function SettingsPage({}: Props) {
  const authUser = await currentUser();

  if (!authUser) null;

  const user = await db.user.findUnique({
    where: {
      clerkId: authUser!.id,
    },
  });

  const removeProfileImage = async () => {
    "use server";

    const res = await db.user.update({
      where: {
        clerkId: authUser!.id,
      },
      data: {
        profileImage: "",
      },
    });

    return res;
  };

  const uploadProfileImage = async (image: string) => {
    "use server";

    const res = await db.user.update({
      where: {
        clerkId: authUser!.id,
      },
      data: {
        profileImage: image,
      },
    });

    return res;
  };

  const updateUserInfo = async (name: string) => {
    "use server";

    const res = await db.user.update({
      where: {
        clerkId: authUser!.id,
      },
      data: {
        name,
      },
    });

    return res;
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or Update your information.
          </p>
        </div>
        <ProfilePicture
          onDelete={removeProfileImage}
          userImage={user?.profileImage || ""}
          onUpload={uploadProfileImage}
        />
        <ProfileForm user={user!} onUpdate={updateUserInfo} />
      </div>
    </div>
  );
}
