"use client";

import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useOrganization } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const { organization } = useOrganization();
  const { isOpen, onClose: onCloseModal } = useCoverImage();
  const { edgestore } = useEdgeStore();
  const update = useMutation(api.documents.update);

  const [file, setFile] = useState<File>();
  const [isSubmiting, setIsSubmiting] = useState(false);

  if (!organization) {
    return null;
  }

  const onClose = () => {
    setFile(undefined);
    setIsSubmiting(false);
    onCloseModal();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmiting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
      });

      await update({
        id: params.documentId as Id<"documents">,
        orgId: organization.id,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Обложка</h2>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmiting}
            value={file}
            onChange={onChange}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
