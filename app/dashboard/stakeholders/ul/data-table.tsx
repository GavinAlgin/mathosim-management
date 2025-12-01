// components/FileTable.tsx
"use client"
import React from "react"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { DataTableRowActions } from "./components/RowsActions"

interface FileRecord {
  id: string
  fileName: string
  size: string
  uploadedAt: string
  uploadedBy: string
}

interface FileTableProps {
  data: FileRecord[]
}

export default function FileTable({ data }: FileTableProps) {
  const columns = React.useMemo<ColumnDef<FileRecord>[]>(() => [
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "size",
      header: "File Size",
    },
    {
      accessorKey: "uploadedAt",
      header: "Date Uploaded",
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ], [])

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : header.renderHeader()}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{cell.renderCell()}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No files uploaded
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
