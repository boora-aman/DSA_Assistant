"use client"

// Simplified version of the use-toast hook
import { useState, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(({ title, description, variant = "default" }: ToastProps) => {
    setToasts((prev) => [...prev, { title, description, variant }])

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 5000)
  }, [])

  return { toast, toasts }
}

