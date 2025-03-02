"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function DemoSection() {
  const [currentStep, setCurrentStep] = useState(0)

  const demoConversation = [
    {
      user: "I'm trying to solve the Two Sum problem but I'm not sure where to start.",
      assistant:
        "I'd be happy to guide you! The Two Sum problem asks you to find two numbers in an array that add up to a target value. What approaches can you think of to solve this?",
    },
    {
      user: "I guess I could check every pair of numbers?",
      assistant:
        "That's a good starting point! That would be the brute force approach. Can you think about how you would implement this? What would be the time complexity?",
    },
    {
      user: "I would use two loops to check each pair. I think the time complexity would be O(n²).",
      assistant:
        "Excellent! That's correct. The brute force approach with two nested loops would have O(n²) time complexity. Now, can you think of a more efficient approach? What data structure might help us reduce the time complexity?",
    },
    {
      user: "Maybe a hash map? We could store values we've seen before.",
      assistant:
        "That's exactly right! Using a hash map (or dictionary/object) can help us solve this in O(n) time. For each number, we can check if the complement (target - current number) exists in our hash map. If it does, we've found our pair. If not, we add the current number to the hash map and continue.",
    },
  ]

  const handleNext = () => {
    if (currentStep < demoConversation.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">See how it works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI assistant guides you through problems using the Socratic method, helping you learn without giving
              away solutions.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl py-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Two Sum Problem</CardTitle>
              <CardDescription>A guided conversation about the classic Two Sum algorithm problem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoConversation.slice(0, currentStep + 1).map((message, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center text-sm font-medium">
                      U
                    </div>
                    <div className="bg-muted rounded-lg p-4 flex-1">
                      <p>{message.user}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-sm font-medium text-primary-foreground">
                      A
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 flex-1">
                      <p>{message.assistant}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                Previous
              </Button>
              {currentStep < demoConversation.length - 1 ? (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button asChild>
                  <a href="/chat">Try it yourself</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

