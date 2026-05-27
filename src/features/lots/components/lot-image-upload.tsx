"use client";

import { useRef } from "react";
import { useUploadLotImageMutation } from "../queries/lots-queries";
import { toast } from "sonner";
import Button from "@/components/ui/buttons/button";

export default function LotImageUpload({ lotId }: { lotId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const mutation = useUploadLotImageMutation();

  function handleUpload(file: File) {
    toast.promise(mutation.mutateAsync({ lotId, file }), {
      loading: "Uploading image...",
      success: "Image uploaded.",
      error: "Upload failed.",
    });
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} isLoading={mutation.isPending}>
        Upload Image
      </Button>
    </div>
  );
}
