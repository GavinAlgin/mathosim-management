"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconAlertCircle, IconFileImport } from "@tabler/icons-react"
import { Loader2, UploadCloud } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export function UploadModal() {
    const [dragActive, setDragActive] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const [filePreview, setFilePreview] = React.useState<string | null>(null)
    const [fileName, setFileName] = React.useState<string | null>(null)
    const [uploading, setUploading] = React.useState(false)

    const handleFile = (file: File) => {
        setFileName(file.name)
        setUploading(true)
    
        if (file.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setFilePreview(reader.result as string)
            setUploading(false)
            toast.success("Successfully uploaded image")
          }
          reader.readAsDataURL(file)
        } else {
          setFilePreview(null)
          setTimeout(() => setUploading(false), 1000)
        }
    }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          {/* <Button variant="outline">Open Dialog</Button> */}
          <Button><IconFileImport /> Upload file</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload file</DialogTitle>
            <DialogDescription>
              Add your files or documents here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div
            className={`border-2 border-dashed p-6 text-center cursor-pointer rounded ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setDragActive(false)}>
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> :
              filePreview ? <Image src={filePreview} alt="Preview" width={100} height={100} className="mx-auto mb-2 rounded" /> :
                <UploadCloud className="w-8 h-8 mx-auto mb-2" />}
            <p className="text-sm">{fileName || "Drag & drop or click to upload image"}</p>
            <input type="file" ref={inputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
          </div>
          <DialogDescription>
            <div className="flex flex-row justify-between">
                <span className="text-[10px] text-gray-500 items-center"><IconAlertCircle className="h-4 w-4" /> Supported files: .docx, .png, .pdf, .cvs, .txt, .zip </span>
                <span className="text-[10px] text-gray-500">Maximum size: 50MB</span>
            </div>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
