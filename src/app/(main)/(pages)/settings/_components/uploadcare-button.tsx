"use client";

import * as LR from "@uploadcare/blocks";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import { User } from "@prisma/client";

type Props = {
  onUpload?: (image: string) => Promise<User>;
};

LR.registerBlocks(LR);

export default function UploadCareButton({ onUpload }: Props) {
  const router = useRouter();
  const ctxProviderRef = useRef<
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  >(null);

  useEffect(() => {
    const handleUpload = async (image: string | any) => {
      const file = await onUpload!(image.detail.cdnUrl);
      if (file) return router.refresh();
    };

    ctxProviderRef.current?.addEventListener(
      "file-upload-success",
      handleUpload
    );
  }, []);

  return (
    <div>
      <lr-config ctx-name="my-uploader" pubkey="fed2ef351caca0086cdc" />
      <lr-file-uploader-regular ctx-name="my-uploader" />
      <lr-upload-ctx-provider ref={ctxProviderRef} ctx-name="my-uploader" />
    </div>
  );
}
