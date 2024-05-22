"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MenuIcon, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import Banner from "./banner";
import { Menu } from "./menu";
import { Pusblish } from "./pusblish";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/use-content";

interface NavbarProps {
  orgId?: string;
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({
  isCollapsed,
  onResetWidth,
  orgId = "",
}: NavbarProps) => {
  const params = useParams();
  const document = useQuery(api.documents.getById, {
    orgId,
    documentId: params.documentId as Id<"documents">,
  });
  const { isSaved, content, saveContent } = useContent();
  const update = useMutation(api.documents.update);

  const onSave = () => {
    update({
      id: params.documentId as Id<"documents">,
      orgId,
      content,
    });
    saveContent();
  };

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between gap-x-4">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Button
              size="sm"
              variant="default"
              disabled={isSaved}
              onClick={onSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить изменения
            </Button>
            <Pusblish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
