"use client"

import { useState, useEffect } from "react"

export function usePanelSize(key: string, defaultSize: number, minSize = 200, maxSize = 800) {
  const [size, setSize] = useState(defaultSize)

  useEffect(() => {
    const saved = localStorage.getItem(`panel-size-${key}`)
    if (saved) {
      const parsedSize = Number.parseInt(saved, 10)
      if (parsedSize >= minSize && parsedSize <= maxSize) {
        setSize(parsedSize)
      }
    }
  }, [key, minSize, maxSize])

  useEffect(() => {
    localStorage.setItem(`panel-size-${key}`, size.toString())
  }, [key, size])

  const increaseSize = () => {
    setSize((prev) => Math.min(prev + 50, maxSize))
  }

  const decreaseSize = () => {
    setSize((prev) => Math.max(prev - 50, minSize))
  }

  return {
    size,
    increaseSize,
    decreaseSize,
    setSize,
  }
}
