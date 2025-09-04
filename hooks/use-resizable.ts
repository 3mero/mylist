"use client"

import { useState, useCallback, useEffect } from "react"

interface UseResizableProps {
  initialWidth: number
  minWidth?: number
  maxWidth?: number
}

export function useResizable({ initialWidth, minWidth = 200, maxWidth = 500 }: UseResizableProps) {
  const [width, setWidth] = useState(initialWidth)
  const [isResizing, setIsResizing] = useState(false)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth)
        }
      }
    },
    [isResizing, minWidth, maxWidth],
  )

  useEffect(() => {
    document.addEventListener("mousemove", resize)
    document.addEventListener("mouseup", stopResizing)
    return () => {
      document.removeEventListener("mousemove", resize)
      document.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return {
    width,
    isResizing,
    startResizing,
  }
}
