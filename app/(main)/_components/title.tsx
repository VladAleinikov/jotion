"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface TitleProps {
  initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTitle = useMutation(api.documents.update);

  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);

    if (initialData.title !== inputRef.current?.value && inputRef.current) {
      const promise = updateTitle({
        orgId: initialData.orgId,
        id: initialData._id,
        title: inputRef.current.value,
      });

      toast.promise(promise, {
        loading: "Переименовываем запись...",
        success: "Запись переименована!",
        error: "Не удалось переименовать запись",
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          className="h-7 px-2 focus-visible:ring-transparent"
          defaultValue={initialData.title}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};


Title.Skeleton = function TitleSkeleton() {
  return (
    <Skeleton className="h-7 w-20 rounded-md"/>
  )
}