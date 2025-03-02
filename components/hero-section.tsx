import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Master Data Structures & Algorithms
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Learn DSA concepts through guided problem-solving. Our AI assistant helps you understand problems
                without giving away solutions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/chat">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden border bg-background p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  <div className="p-4 max-w-[80%] bg-primary/10 rounded-lg mb-4">
                    <p className="text-sm">I'm trying to solve the Two Sum problem but I'm stuck. Can you help?</p>
                  </div>
                  <div className="p-4 max-w-[80%] bg-primary text-primary-foreground rounded-lg ml-auto mb-4">
                    <p className="text-sm">
                      I'd be happy to guide you! Let's break down the Two Sum problem. What's your current understanding
                      of the problem?
                    </p>
                  </div>
                  <div className="p-4 max-w-[80%] bg-primary/10 rounded-lg mb-4">
                    <p className="text-sm">
                      I understand we need to find two numbers that add up to a target, but I'm not sure about the most
                      efficient approach.
                    </p>
                  </div>
                  <div className="p-4 max-w-[80%] bg-primary text-primary-foreground rounded-lg ml-auto">
                    <p className="text-sm">
                      Great! Let's think about this step by step. What's the brute force approach? And then we can
                      consider how to optimize it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

