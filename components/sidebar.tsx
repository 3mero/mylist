"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, Edit2, Trash2, Play, Shuffle, Download, Upload, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { usePlaylist } from "@/contexts/playlist-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SidebarProps {
  isOpen: boolean
  width: number
}

export function Sidebar({ isOpen, width }: SidebarProps) {
  const {
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    playVideo,
    exportPlaylists,
    importPlaylists,
    addToQueue,
    showNotification,
  } = usePlaylist()

  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [isAddingToQueue, setIsAddingToQueue] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleRenamePlaylist = (id: string) => {
    if (editName.trim()) {
      renamePlaylist(id, editName.trim())
      setEditingPlaylist(null)
      setEditName("")
    }
  }

  const playAllPlaylist = (playlist: any) => {
    if (playlist.videos.length > 0) {
      setCurrentPlaylist(playlist)
      playVideo(playlist.videos[0])
    }
  }

  const shufflePlaylist = (playlist: any) => {
    if (playlist.videos.length > 0) {
      const shuffled = [...playlist.videos].sort(() => Math.random() - 0.5)
      setCurrentPlaylist({ ...playlist, videos: shuffled })
      playVideo(shuffled[0])
    }
  }

  const handleExport = () => {
    exportPlaylists()
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await importPlaylists(file)
        showNotification("تم استيراد قوائم التشغيل بنجاح!")
      } catch (error) {
        showNotification("فشل في استيراد الملف. تأكد من أن الملف صحيح.", "error")
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleAddToQueue = async () => {
    if (!videoUrl.trim()) return

    setIsAddingToQueue(true)
    try {
      await addToQueue(videoUrl.trim())
      setVideoUrl("")
    } catch (error) {
      // Error notification is handled in addToQueue function
    } finally {
      setIsAddingToQueue(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <aside
        className="fixed right-0 top-20 h-[calc(100vh-5rem)] bg-sidebar/95 backdrop-blur-md border-l border-sidebar-border/50 overflow-y-auto shadow-xl animate-slide-up"
        style={{ width: `${width}px` }}
      >
        <div className="flex items-center justify-between p-2 bg-sidebar-accent/20 border-b border-sidebar-border/30">
          <h2 className="text-sm font-semibold text-sidebar-foreground font-serif">قوائم التشغيل</h2>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-sidebar-primary/20 transition-all duration-200"
            title="طي القائمة"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="p-3 space-y-3">
          <div className="mb-4 p-3 bg-sidebar-accent/10 rounded-lg border border-sidebar-border/30">
            <h3 className="text-sm font-medium text-sidebar-foreground mb-2 font-serif">
              إضافة فيديو إلى قائمة الانتظار
            </h3>
            <div className="space-y-2">
              <Input
                placeholder="رابط YouTube..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isAddingToQueue && handleAddToQueue()}
                className="text-xs h-8 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200"
                disabled={isAddingToQueue}
              />
              <Button
                onClick={handleAddToQueue}
                disabled={!videoUrl.trim() || isAddingToQueue}
                className="w-full h-8 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-md"
              >
                {isAddingToQueue ? "جاري الإضافة..." : "إضافة إلى قائمة الانتظار"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-sidebar-foreground font-serif">قوائم التشغيل</h2>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-sidebar-primary to-secondary hover:from-sidebar-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg text-xs px-2 py-1 h-7"
                >
                  <Plus className="h-3 w-3 ml-1" />
                  إنشاء
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-scale-in">
                <DialogHeader>
                  <DialogTitle className="font-serif">إنشاء قائمة تشغيل جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="اسم قائمة التشغيل..."
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCreatePlaylist()}
                    className="focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreatePlaylist}
                      className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200"
                    >
                      إنشاء
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1 hover:bg-muted/50 transition-all duration-200"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-1 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex-1 text-xs bg-transparent hover:bg-muted/50 transition-all duration-200 border-border/50 h-7 px-2"
            >
              <Download className="h-3 w-3 ml-1" />
              تصدير
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex-1 text-xs bg-transparent hover:bg-muted/50 transition-all duration-200 border-border/50 h-7 px-2"
            >
              <Upload className="h-3 w-3 ml-1" />
              استيراد
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="space-y-2 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {playlists.map((playlist, index) => (
              <Card
                key={playlist.id}
                className={`p-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-border/50 animate-fade-in ${
                  currentPlaylist?.id === playlist.id
                    ? "bg-gradient-to-r from-sidebar-accent/20 to-secondary/10 border-sidebar-primary/30 shadow-md"
                    : "hover:bg-sidebar-accent/10"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setCurrentPlaylist(playlist)}
              >
                <div className="flex items-center justify-between gap-2">
                  {editingPlaylist === playlist.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleRenamePlaylist(playlist.id)
                        if (e.key === "Escape") setEditingPlaylist(null)
                      }}
                      onBlur={() => handleRenamePlaylist(playlist.id)}
                      className="text-xs focus:ring-2 focus:ring-primary/20 h-6 flex-1"
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 min-w-0 pr-1 overflow-hidden">
                      <h3
                        className="font-medium text-sidebar-foreground text-xs font-serif leading-tight overflow-hidden text-ellipsis whitespace-nowrap"
                        title={playlist.name}
                      >
                        {playlist.name}
                      </h3>
                      <p className="text-xs text-sidebar-foreground/70 mt-0.5 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                        {playlist.videos.length} فيديو
                      </p>
                    </div>
                  )}

                  <div className="flex gap-0.5 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        playAllPlaylist(playlist)
                      }}
                      className="h-6 w-6 p-0 hover:bg-sidebar-primary/20 hover:text-sidebar-primary transition-all duration-200"
                    >
                      <Play className="h-2.5 w-2.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        shufflePlaylist(playlist)
                      }}
                      className="h-6 w-6 p-0 hover:bg-sidebar-primary/20 hover:text-sidebar-primary transition-all duration-200"
                    >
                      <Shuffle className="h-2.5 w-2.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingPlaylist(playlist.id)
                        setEditName(playlist.name)
                      }}
                      className="h-6 w-6 p-0 hover:bg-accent/50 transition-all duration-200"
                    >
                      <Edit2 className="h-2.5 w-2.5" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePlaylist(playlist.id)
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
