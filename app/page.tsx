"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { VideoPlayer } from "@/components/video-player"
import { RecentVideos } from "@/components/recent-videos"
import { HistoryPanel } from "@/components/history-panel"
import { Notification } from "@/components/notification"
import { PlaylistProvider } from "@/contexts/playlist-context"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [historyOpen, setHistoryOpen] = useState(true)

  const sidebarWidth = 280
  const historyWidth = 300

  return (
    <PlaylistProvider>
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
        />
        <Notification />

        <div className="flex justify-center">
          <div className="w-full max-w-6xl flex relative">
            <Sidebar isOpen={sidebarOpen} width={sidebarWidth} />

            <main
              className="flex-1 transition-all duration-300"
              style={{
                marginRight: sidebarOpen ? `${sidebarWidth}px` : "0",
                marginLeft: historyOpen ? `${historyWidth}px` : "0",
              }}
            >
              <div className="p-4 max-w-4xl mx-auto">
                <VideoPlayer />
                <RecentVideos />
              </div>
            </main>

            <HistoryPanel isOpen={historyOpen} width={historyWidth} />
          </div>
        </div>
      </div>
    </PlaylistProvider>
  )
}
