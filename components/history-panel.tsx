"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Play, ChevronLeft } from "lucide-react"
import { usePlaylist } from "@/contexts/playlist-context"

interface HistoryPanelProps {
  isOpen: boolean
  width: number
}

export function HistoryPanel({ isOpen, width }: HistoryPanelProps) {
  const { history, clearHistory, playVideo } = usePlaylist()

  if (!isOpen) return null

  return (
    <div
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border shadow-lg transition-all duration-300 z-40 overflow-hidden"
      style={{ width: `${width}px` }}
    >
      <div className="flex items-center justify-between p-2 bg-accent/20 border-b border-border/30">
        <h2 className="text-sm font-semibold text-foreground font-serif">السجل</h2>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-primary/20 transition-all duration-200"
          title="طي القائمة"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={clearHistory}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            مسح الكل
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">آخر {history.length} فيديو تم مشاهدته</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">لا يوجد سجل مشاهدة</div>
            <p className="text-sm text-muted-foreground">ستظهر الفيديوهات التي شاهدتها هنا</p>
          </div>
        ) : (
          history.map((video, index) => (
            <Card key={`${video.id}-${video.watchedAt.getTime()}`} className="p-3 hover:bg-accent/50 transition-colors">
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.customTitle || video.title}
                    className="w-20 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => playVideo(video)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20 rounded cursor-pointer">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">{index + 1}</div>
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3
                    className="font-medium text-sm cursor-pointer hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                    onClick={() => playVideo(video)}
                    title={video.customTitle || video.title}
                  >
                    {video.customTitle || video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    تم المشاهدة:{" "}
                    {video.watchedAt.toLocaleDateString("ar-SA", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
