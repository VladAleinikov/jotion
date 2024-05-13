"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import {
  CreateOrganization,
  useOrganization,
  useUser,
} from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { organization } = useOrganization();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    if (organization) {
      const promise = create({
        title: "Untitled",
        orgId: organization?.id,
      }).then((documentId) => router.push(`/documents/${documentId}`));

      toast.promise(promise, {
        loading: "Создаем новую запись...",
        success: "Запись создана!",
        error: "Не удалось создать запись",
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/question.svg"
        height={300}
        width={300}
        alt="question"
        className="dark:hidden"
      />
      <Image
        src="/question-dark.svg"
        height={300}
        width={300}
        alt="question"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium text-center">
        Добро пожаловать в {organization?.name || user?.firstName}&apos;s Jotion
        <br />
        {!organization ? "Нет оргонизации?" : "Добавим запись?"}
      </h2>
      {!organization ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Создать оргонизацию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateOrganization routing="hash" />
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить запись
        </Button>
      )}
    </div>
  );
};

export default DocumentsPage;
