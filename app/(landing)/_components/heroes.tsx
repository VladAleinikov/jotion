import Image from "next/image"

export const Heroes = () => {
  return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
              <div className="flex items-center">
                    <div className="relative w-[500px] h-[500px] sm:w-[350px] sm:h-[350px] md:w-[600px] md:h-[600px]">
                          <Image
                              src="/hero.png"
                              fill
                                alt="Hero"
                                className="object-cover dark:hidden"
                          />
                          <Image
                              src="/hero-dark.png"
                              fill
                                alt="Hero"
                                className="object-cover hidden dark:block"
                          />
                    </div>
              </div>
    </div>
  )
}
