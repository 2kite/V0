"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Upload,
  FolderPlus,
  List,
  Filter,
  Folder,
  ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
  MoreHorizontal,
  Star,
  Download,
  Trash2,
  Share2,
  Pin,
  Move,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

const categories = [
  { name: "All Files", count: 1247, active: true },
  { name: "Documents", count: 432, active: false },
  { name: "Images", count: 289, active: false },
  { name: "Videos", count: 156, active: false },
  { name: "Audio", count: 78, active: false },
  { name: "Archives", count: 45, active: false },
  { name: "Favorites", count: 23, active: false },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "folder":
      return <Folder className="w-5 h-5 text-blue-400" />
    case "image":
      return <ImageIcon className="w-5 h-5 text-green-400" />
    case "video":
      return <Video className="w-5 h-5 text-red-400" />
    case "audio":
      return <Music className="w-5 h-5 text-purple-400" />
    case "archive":
      return <Archive className="w-5 h-5 text-yellow-400" />
    default:
      return <FileText className="w-5 h-5 text-gray-400" />
  }
}

interface FileItem {
  id: number
  name: string
  type: string
  size: string
  modified: string
  starred: boolean
  pinned: boolean
  x: number
  y: number
}

export default function FileStoragePage() {
  const [viewMode, setViewMode] = useState<"canvas" | "list">("canvas")
  const [searchQuery, setSearchQuery] = useState("")
  const canvasRef = useRef<HTMLDivElement>(null)

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: "Project Presentation.pptx",
      type: "document",
      size: "2.4 MB",
      modified: "2 hours ago",
      starred: true,
      pinned: false,
      x: 50,
      y: 50,
    },
    {
      id: 2,
      name: "Design Assets",
      type: "folder",
      size: "156 items",
      modified: "1 day ago",
      starred: false,
      pinned: false,
      x: 300,
      y: 80,
    },
    {
      id: 3,
      name: "Screenshot 2024.png",
      type: "image",
      size: "1.2 MB",
      modified: "3 hours ago",
      starred: false,
      pinned: true,
      x: 150,
      y: 200,
    },
    {
      id: 4,
      name: "Meeting Recording.mp4",
      type: "video",
      size: "45.6 MB",
      modified: "1 week ago",
      starred: true,
      pinned: false,
      x: 450,
      y: 150,
    },
    {
      id: 5,
      name: "Budget Report.xlsx",
      type: "document",
      size: "890 KB",
      modified: "2 days ago",
      starred: false,
      pinned: false,
      x: 200,
      y: 350,
    },
    {
      id: 6,
      name: "Music Collection",
      type: "folder",
      size: "78 items",
      modified: "1 month ago",
      starred: false,
      pinned: false,
      x: 500,
      y: 300,
    },
    {
      id: 7,
      name: "App Mockups.fig",
      type: "document",
      size: "3.1 MB",
      modified: "5 hours ago",
      starred: false,
      pinned: false,
      x: 350,
      y: 250,
    },
    {
      id: 8,
      name: "Archive_2024.zip",
      type: "archive",
      size: "12.3 MB",
      modified: "1 week ago",
      starred: false,
      pinned: false,
      x: 100,
      y: 450,
    },
  ])

  const [draggedFile, setDraggedFile] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent, fileId: number) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    const rect = e.currentTarget.getBoundingClientRect()
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    setDraggedFile(fileId)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y

      // 캔버스 경계 내에서만 이동 가능
      const maxX = canvasRect.width - 280 // 카드 너비 고려
      const maxY = canvasRect.height - 150 // 카드 높이 고려

      const clampedX = Math.max(0, Math.min(newX, maxX))
      const clampedY = Math.max(0, Math.min(newY, maxY))

      setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileId ? { ...f, x: clampedX, y: clampedY } : f)))
    }

    const handleMouseUp = () => {
      setDraggedFile(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const togglePin = (fileId: number) => {
    setFiles(files.map((file) => (file.id === fileId ? { ...file, pinned: !file.pinned } : file)))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-gray-900 rounded-sm"></div>
              </div>
              <h1 className="text-xl font-semibold">Yeon's Storage</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-800/50 border-gray-700 focus:border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>

            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>

            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900/30 backdrop-blur-xl">
          <div className="p-6">
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    category.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>

            <Separator className="my-6 bg-gray-800" />

            <div className="space-y-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Used</span>
                  <span className="text-white">2.4 GB</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="text-xs text-gray-500">2.4 GB of 5 GB used</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-semibold mb-1">All Files</h2>
              <p className="text-gray-400">1,247 items • Drag files to arrange freely</p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "canvas" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("canvas")}
                className={viewMode === "canvas" ? "bg-gray-800" : "text-gray-400 hover:text-white"}
              >
                <Move className="w-4 h-4 mr-2" />
                Canvas
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-gray-800" : "text-gray-400 hover:text-white"}
              >
                <List className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>

          {/* Canvas View */}
          {viewMode === "canvas" ? (
            <div
              ref={canvasRef}
              className="flex-1 relative bg-gray-950 overflow-hidden"
              style={{ minHeight: "calc(100vh - 200px)" }}
            >
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Files */}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="absolute"
                  style={{
                    left: file.x,
                    top: file.y,
                    transform: draggedFile === file.id ? "scale(1.05)" : "scale(1)",
                    zIndex: draggedFile === file.id ? 1000 : 1,
                  }}
                >
                  <Card
                    className={`w-72 bg-gray-900/80 border-gray-700 hover:bg-gray-800/80 transition-all duration-200 cursor-move backdrop-blur-sm ${
                      file.pinned ? "ring-2 ring-blue-500/50 bg-blue-900/30" : ""
                    } ${draggedFile === file.id ? "shadow-2xl shadow-blue-500/20" : "shadow-lg"}`}
                    onMouseDown={(e) => handleMouseDown(e, file.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          {file.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          {file.pinned && <Pin className="w-4 h-4 text-blue-400 fill-current" />}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-70 hover:opacity-100 transition-opacity"
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              className="text-gray-300 hover:bg-gray-700"
                              onClick={() => togglePin(file.id)}
                            >
                              <Pin className="w-4 h-4 mr-2" />
                              {file.pinned ? "Unpin" : "Pin to position"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1 truncate">{file.name}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{file.size}</span>
                          <span>{file.modified}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Canvas Instructions */}
              <div className="absolute bottom-6 left-6 text-gray-500 text-sm">
                <div className="flex items-center space-x-2">
                  <Move className="w-4 h-4" />
                  <span>Drag files to arrange them freely on the canvas</span>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="flex-1 p-6">
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors group ${
                      file.pinned ? "bg-blue-900/20 border border-blue-500/30" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{file.name}</span>
                          {file.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                          {file.pinned && <Pin className="w-4 h-4 text-blue-400 fill-current" />}
                        </div>
                        <div className="text-sm text-gray-400">
                          {file.size} • {file.modified}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem
                          className="text-gray-300 hover:bg-gray-700"
                          onClick={() => togglePin(file.id)}
                        >
                          <Pin className="w-4 h-4 mr-2" />
                          {file.pinned ? "Unpin" : "Pin to position"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
