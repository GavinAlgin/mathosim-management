// components/UploadModal.tsx
"use client"
import React, { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconFile, IconFileText } from "@tabler/icons-react"

export function UploadModal({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const renderIcon = () => {
    if (!file) return null
    if (file.name.endsWith(".pdf")) return <IconFile className="h-6 w-6 text-red-600" />
    if (file.name.endsWith(".docx")) return <IconFileText className="h-6 w-6 text-blue-600" />
    return <IconFileText className="h-6 w-6" />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconFileText className="mr-2 h-4 w-4" /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {renderIcon()}
            <Label htmlFor="file-upload" className="flex-1">
              {file?.name ?? "Choose a file…"}
            </Label>
          </div>
          <Input id="file-upload" type="file" onChange={handleChange} />
          <div className="text-right">
            <Button
              disabled={!file}
              onClick={() => {
                file && onUpload(file)
                setFile(null)
              }}>
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
