"use client";

import { useRouter } from "next/navigation";
import UploadCareButton from "./uploadcare-button";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { User } from "@prisma/client";

type Props = {
  userImage: string | null;
  onDelete?: () => Promise<User>;
  onUpload?: (image: string) => Promise<User>;
};

export default function ProfilePicture({
  userImage,
  onDelete,
  onUpload,
}: Props) {
  const router = useRouter();

  const onRemoveProfileImage = async () => {
    const res = await onDelete!();
    if (res) router.refresh();
  };

  return (
    <div className="flex flex-col">
      <p className="text-lg text-white">Profile Picture</p>
      <div className="flex h-[30vh] flex-col items-center justify-center">
        {userImage ? (
          <>
            <div className="relative h-full w-2/12">
              <Image
                src={userImage}
                className="object-contain"
                fill
                alt="user-image"
              />
            </div>
            <Button
              onClick={onRemoveProfileImage}
              className="bg-transparent text-white/70 hover:bg-transparent hover:text-white"
            >
              <X /> Remove Logo
            </Button>
          </>
        ) : (
          <UploadCareButton onUpload={onUpload} />
        )}
      </div>
    </div>
  );
}
