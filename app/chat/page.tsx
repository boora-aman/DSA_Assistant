"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LinkIcon, Loader2, RefreshCw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ChatMessage } from "@/components/chat-message"
import { useChat } from "@/lib/use-chat"
const MAX_MESSAGES = 100;

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [leetCodeUrl, setLeetCodeUrl] = useState("")
  const [isUrlValid, setIsUrlValid] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {  messages: allMessages, input, setInput, handleSubmit, isLoading, error, reset } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I'm your DSA Learning Assistant. I can help you understand Data Structures and Algorithms problems without giving away complete solutions. To get started, you can paste a LeetCode problem URL or just ask me a question about a DSA concept or problem you're working on.",
      },
    ],
    body: {
      leetCodeUrl,
    },
    onError: (error) => {
      const errorMessage = error.message || "Something went wrong"
      if (errorMessage.includes("rate limit")) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please wait a moment before sending another message.",
          variant: "destructive",
        })
      } else if (errorMessage.includes("API key")) {
        toast({
          title: "API Key Error",
          description: "There's an issue with the API configuration. Please try again later.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    },
  })
  const messages = allMessages.slice(-MAX_MESSAGES);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }

  const validateLeetCodeUrl = (url: string) => {
    if (!url) return true
    const leetCodeRegex = /^https:\/\/(leetcode\.com|leetcode\.cn)\/problems\/[a-zA-Z0-9-]+\/?/
    return leetCodeRegex.test(url)
  }

  const handleLeetCodeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setLeetCodeUrl(url)
    setIsUrlValid(validateLeetCodeUrl(url))
  }

  const handleNewChat = () => {
    reset()
    setLeetCodeUrl("")
    setIsUrlValid(true)
  }



  return (
    <div className="container py-6 md:py-10 max-w-5xl h-screen overflow-hidden">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>DSA Learning Assistant</CardTitle>
              <CardDescription>Ask questions about algorithms and data structures</CardDescription>
            </div>
            <Button variant="outline" onClick={handleNewChat}>
              <RefreshCw className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Paste LeetCode URL (optional)"
              value={leetCodeUrl}
              onChange={handleLeetCodeUrlChange}
              className={!isUrlValid ? "border-destructive" : ""}
            />
          </div>
          {!isUrlValid && (
            <p className="text-sm text-destructive mt-1">
              Please enter a valid LeetCode URL (e.g., https://leetcode.com/problems/two-sum/)
            </p>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 rounded-lg p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>The AI assistant is thinking about your question...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Textarea
              placeholder="Ask a question about DSA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-12 flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}