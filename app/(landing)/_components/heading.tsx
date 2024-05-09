"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const Heading = () => {

  return (
        <div className="max-w-3xl  space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                    Ваши Идеи, Документы, и Планы. Вместе. Добро пожаловать в <span className="underline">Jotion</span>
              </h1>
              <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                    Jotion это рабочее пространство, где<br />
                    легче, быстрее и удобнее работать!
              </h3>
              <Button>
                    Войти
                    <ArrowRight className="h-4 w-4 ml-2"/>
              </Button>
    </div>
  )
}
