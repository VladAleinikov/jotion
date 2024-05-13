"use client";

import {Cover} from "@/components/cover";
import { Editor } from "@/components/editor";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { organization } = useOrganization();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
    orgId: organization?.id!,
  });

  const update = useMutation(api.documents.update)

  if (document === undefined || !organization) {
    return <div>
      <Cover.Skeleton />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 pl-8 pt-4">
          <Skeleton className="h-14 w-[50%]"/>
          <Skeleton className="h-4 w-[80%]"/>
          <Skeleton className="h-4 w-[70%]"/>
          <Skeleton className="h-4 w-[40%]"/>
        </div>
      </div>
    </div>;
  }
  if (document === null) {
    return <div>Не найдено</div>;
  }

  const onChange = (content: string) => {
    update({
      id: params.documentId,
      orgId: organization.id,
      content,
    });
  };

  return <div className="pb-40">
    <Cover url={document.coverImage} />
    <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
      <Toolbar initialData={document}/>
      <Editor
      onChange={onChange}
      initialContent={document.content}
      />
    </div>
  </div>;
};

export default DocumentIdPage;
