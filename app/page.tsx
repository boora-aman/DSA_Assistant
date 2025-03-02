"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function DSAAssistant() {
  const [leetCodeUrl, setLeetCodeUrl] = useState("")
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your DSA Teaching Assistant. Please share a LeetCode problem URL and your specific question, and I'll help guide you toward understanding the problem without giving away the solution."
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = (role: Message['role'], content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content
    }])
  }

  const handleLeetCodeSubmit = async (e) => {
    e.preventDefault()
    if (!leetCodeUrl.trim() || !question.trim()) return

    const fullQuestion = `LeetCode Problem: ${leetCodeUrl}\n\nMy Question: ${question}`
    
    setIsLoading(true)
    addMessage("user", fullQuestion)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: fullQuestion }]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      addMessage("assistant", data.content)
    } catch (error) {
      console.error("Error:", error)
      addMessage("assistant", "Sorry, there was an error processing your request. Please try again.")
    } finally {
      setIsLoading(false)
      setLeetCodeUrl("")
      setQuestion("")
    }
  }

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    addMessage("user", input)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      addMessage("assistant", data.content)
    } catch (error) {
      console.error("Error:", error)
      addMessage("assistant", "Sorry, there was an error processing your request. Please try again.")
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="bg-white border-b">
          <CardTitle>DSA Teaching Assistant</CardTitle>
          <CardDescription>
            Get guidance on data structures and algorithms problems without direct solutions
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start max-w-[80%] gap-2">
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <div className="flex flex-col space-y-4 p-4 border-t bg-white">
          {messages.length <= 1 ? (
            <form onSubmit={handleLeetCodeSubmit} className="w-full space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="leetcode-url">LeetCode Problem URL</Label>
                <Input
                  id="leetcode-url"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={leetCodeUrl}
                  onChange={(e) => setLeetCodeUrl(e.target.value)}
                  required
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  placeholder="I'm confused about how to approach this problem. Can you give me a hint on where to start?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  "Submit Question"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleFollowUpSubmit} className="flex w-full space-x-2">
              <Input
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}