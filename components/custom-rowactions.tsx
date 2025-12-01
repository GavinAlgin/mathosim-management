'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

type RowActionsProps = {
  onEdit: () => void
  onShare: () => void
  onPrint: () => void
}

export function RowActions({ onEdit, onShare, onPrint }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>Share</DropdownMenuItem>
        <DropdownMenuItem onClick={onPrint}>Print</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
