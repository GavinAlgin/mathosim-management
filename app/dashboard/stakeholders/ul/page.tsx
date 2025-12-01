// app/contract/page.tsx or pages/contract.tsx
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconFileExport } from "@tabler/icons-react"
import { FileTable } from "./components/RowsActions"
import { UploadModal } from "./components/UploadModal"

interface FileRecord {
  id: string
  fileName: string
  size: string
  uploadedAt: string
  uploadedBy: string
}

const ContractPage = () => {
  const [files, setFiles] = useState<FileRecord[]>([])

  const handleUpload = (file: File) => {
    const newRecord: FileRecord = {
      id: `${Date.now()}`,
      fileName: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: "You",
    }
    setFiles(prev => [newRecord, ...prev])
  }

  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Stakeholders Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <IconFileExport className="mr-2 h-4 w-4" /> Download All
          </Button>
          <UploadModal onUpload={handleUpload} />
        </div>
      </div>
      <Separator className="mt-4" />
      <FileTable data={files} />
    </div>
  )
}

export default ContractPage
