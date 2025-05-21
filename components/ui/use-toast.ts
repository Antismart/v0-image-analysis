"use client"

// Simplified version of the toast hook
import { toast as sonnerToast } from "@/components/ui/toast"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    sonnerToast({
      title,
      description,
      variant,
    })
  }

  return {
    toast,
  }
}
