"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { nanoid } from "nanoid"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export type UseChatOptions = {
  api?: string
  initialMessages?: Message[]
  body?: Record<string, any>
  onError?: (error: Error) => void
  onResponse?: (response: Response) => void
}

export function useChat({ api = "/api/chat", initialMessages = [], body = {}, onError, onResponse }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Function to add a user message and fetch the AI response
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      if (!input.trim() || isLoading) return

      setIsLoading(true)
      setError(null)

      // Add user message to state
      const userMessage: Message = {
        id: nanoid(),
        role: "user",
        content: input,
      }

      setMessages((messages) => [...messages, userMessage])
      setInput("")

      try {
        // Send the messages to the API
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            ...body,
          }),
        })

        if (onResponse) {
          onResponse(response)
        }

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to fetch the chat response.")
        }

        // Get the response data
        const data = await response.json()

        // Add assistant message to state
        const assistantMessage: Message = {
          id: nanoid(),
          role: "assistant",
          content: data.content,
        }

        setMessages((messages) => [...messages, assistantMessage])
      } catch (err) {
        const error = err as Error
        setError(error)
        if (onError) {
          onError(error)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [api, body, input, isLoading, messages, onError, onResponse],
  )

  // Function to reset the chat
  const reset = useCallback(() => {
    setMessages(initialMessages)
    setInput("")
    setError(null)
  }, [initialMessages])

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    reset,
  }
}

