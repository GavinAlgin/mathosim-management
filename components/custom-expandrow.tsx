'use client'

import { ChevronDown, ChevronUp } from "lucide-react"

type ExpandRowProps = {
  isOpen: boolean
  onClick: () => void
}

export function ExpandRow({ isOpen, onClick }: ExpandRowProps) {
  return (
    <button onClick={onClick} className="p-2">
      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  )
}
