"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        alt="erro"
        width={600}
        height={600}
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        alt="erro"
        width={600}
        height={600}
        className="hidden dark:block"
      />
      <Button asChild>
        <Link href="/documents">Вернуться на главную</Link>
      </Button>
    </div>
  );
};

export default Error;
