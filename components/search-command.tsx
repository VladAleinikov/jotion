"use client";

import { useOrganization } from "@clerk/clerk-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";

export const SearchCommand = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onClose, toggle } = useSearch((store) => store);

  if (!organization) {
    return null;
  }

  const documents = useQuery(api.documents.getSearch, {
    orgId: organization.id,
  });

  if (!isMounted) {
    return null;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Поиск в ${organization.name}'s Jotion...`} />
      <CommandList>
        <CommandEmpty>Ничего не найдено по запросу.</CommandEmpty>
        <CommandGroup heading="Записи">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
