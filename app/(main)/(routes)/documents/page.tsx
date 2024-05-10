"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  CreateOrganization,
  useOrganization,
  useUser,
} from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const DocumentsPage = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

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
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить запись
        </Button>
      )}
    </div>
  );
};

export default DocumentsPage;
