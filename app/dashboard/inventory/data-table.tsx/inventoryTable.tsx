'use client'

import React, { useState } from 'react'
import { InventoryItem } from '@/hooks/types'
import { RowActions } from '@/components/custom-rowactions'
import { ExpandRow } from '@/components/custom-expandrow'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCcwIcon } from 'lucide-react'

interface InventoryTableProps {
  data: InventoryItem[];
  setData: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onEdit: (item: InventoryItem) => void;
}

export default function InventoryTable({ data, setData, onEdit }: InventoryTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleRow = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id))
  }

  const toggleSelectRow = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }

  const isSelected = (id: string) => selected.has(id)

  const handleDeleteSelected = () => {
    if (selected.size === 0) return
    const confirmed = confirm(`Delete ${selected.size} selected item(s)?`)
    if (confirmed) {
      setData(prev => prev.filter(item => !selected.has(item.id)))
      setSelected(new Set())
    }
  }

  const filteredData = data.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRefresh = () => {
    setSearchQuery('')
    setSelected(new Set())
    setExpandedRow(null)
  }

  return (
    <>
      {/* HEADER */}
      <header className="w-full px-4 py-3 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="text-lg font-medium">
            Total Items: <span className="font-bold">{filteredData.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search items..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh}>
              <RefreshCcwIcon className="w-4 h-4" /> Refresh
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selected.size === 0}>
              Delete Selected
            </Button>
          </div>

        </div>
      </header>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(new Set(filteredData.map(i => i.id)))
                    } else {
                      setSelected(new Set())
                    }
                  }}
                  checked={selected.size > 0 && selected.size === filteredData.length}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-2 text-left">Item Name</th>
              <th className="px-4 py-2 text-left">Model Num</th>
              <th className="px-4 py-2 text-left">Operator</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <tr className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={isSelected(item.id)}
                      onChange={() => toggleSelectRow(item.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-2">{item.itemName}</td>
                  <td className="px-4 py-2">{item.modelNum}</td>
                  <td className="px-4 py-2">{item.operator}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    <span
                      className={cn("px-2 py-1 rounded text-xs font-medium", {
                        "bg-green-100 text-green-800": item.status === "Active",
                        "bg-yellow-100 text-yellow-800": item.status === "pending",
                        "bg-red-100 text-red-800": item.status === "In-active",
                      })}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-2 py-2">
                    <RowActions
                      onEdit={() => onEdit(item)}
                      onShare={() => alert(`Share ${item.itemName}`)}
                      onPrint={() => alert(`Print ${item.itemName}`)}
                    />
                  </td>

                  <td className="px-2 py-2 text-right">
                    <ExpandRow
                      isOpen={expandedRow === item.id}
                      onClick={() => toggleRow(item.id)}
                    />
                  </td>
                </tr>

                {expandedRow === item.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-4 py-4 text-gray-700">
                      <strong>Details:</strong> {item.details || 'No additional information.'}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>

        </table>
      </div>
    </>
  )
}
