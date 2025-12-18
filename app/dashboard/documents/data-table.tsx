"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table"
import { MoreVertical, Filter as FilterIcon, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

/* ----------------------------- Types ----------------------------- */

type FileRow = {
  id: string
  fileName: string
  fileSize: string
  fileType: string
  lastModified: string
  publicUrl: string
}

/* -------------------------- Utilities ---------------------------- */

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const getExtension = (name: string) =>
  name.includes(".") ? name.split(".").pop()!.toLowerCase() : "unknown"

/* -------------------------- Component ---------------------------- */

export default function FilesPage() {
  const [rows, setRows] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState("")
  const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  /* ---------------------- Fetch from Supabase ---------------------- */

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)

      const { data, error } = await supabase.storage
        .from("uploads")
        .list("", {
          limit: 100,
          sortBy: { column: "updated_at", order: "desc" },
        })

      if (error) {
        console.error("Storage error:", error)
        setLoading(false)
        return
      }

      const mapped: FileRow[] = data
        .filter(file => file.metadata?.size)
        .map(file => {
          const { data: url } = supabase.storage
            .from("uploads")
            .getPublicUrl(file.name)

          return {
            id: file.id,
            fileName: file.name,
            fileSize: formatBytes(file.metadata.size),
            fileType: getExtension(file.name),
            lastModified: new Date(file.updated_at!).toLocaleDateString(),
            publicUrl: url.publicUrl,
          }
        })

      setRows(mapped)
      setLoading(false)
    }

    fetchFiles()
  }, [])

  /* --------------------------- Filters ----------------------------- */

  const fileTypes = useMemo(
    () => Array.from(new Set(rows.map(r => r.fileType))),
    [rows]
  )

  const filteredRows = useMemo(() => {
    return rows.filter(file => {
      const matchesSearch = file.fileName
        .toLowerCase()
        .includes(globalFilter.toLowerCase())

      const matchesType =
        fileTypeFilter.length === 0 ||
        fileTypeFilter.includes(file.fileType)

      return matchesSearch && matchesType
    })
  }, [rows, globalFilter, fileTypeFilter])

  /* -------------------------- Columns ------------------------------ */

  const columns = useMemo<ColumnDef<FileRow>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.fileSize} • {row.original.fileType}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                window.open(row.original.publicUrl, "_blank")
              }
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => handleDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  /* -------------------------- Table ------------------------------- */

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  /* -------------------------- Actions ------------------------------ */

  const handleDelete = async (file: FileRow) => {
    await supabase.storage.from("uploads").remove([file.fileName])
    setRows(prev => prev.filter(r => r.id !== file.id))
  }

  const toggleFileType = (type: string) => {
    setFileTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  /* ---------------------------- UI -------------------------------- */

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 relative">
        <Input
          placeholder="Search files..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-[300px]"
        />
        <Button
          variant="outline"
          onClick={() => setFilterOpen(o => !o)}
        >
          <FilterIcon className="h-4 w-4 mr-1" />
          Filter
        </Button>

        {filterOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 p-3 bg-white border rounded-md shadow-lg z-10">
            <p className="mb-2 font-semibold text-sm">File Type</p>
            {fileTypes.map(type => (
              <label key={type} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={fileTypeFilter.includes(type)}
                  onCheckedChange={() => toggleFileType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(hg => (
            <TableRow key={hg.id}>
              {hg.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading files...
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center">
                No files found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center py-4">
        <Button
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}




// import { useState, useMemo } from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   ColumnDef,
//   flexRender,
// } from "@tanstack/react-table"
// import { MoreVertical, Filter as FilterIcon } from "lucide-react"
// import Image from "next/image"

// type File = {
//   id: string
//   fileName: string
//   fileSize: string
//   fileType: string
//   uploadedBy: { name: string; email: string; avatarUrl: string }
//   lastModified: string
// }

// const data: File[] = [
//   {
//     id: "1",
//     fileName: "ProjectPlan",
//     fileSize: '220 kB',
//     fileType: 'docx',
//     uploadedBy: {
//       name: "Alice Johnson",
//       email: "alice@example.com",
//       avatarUrl: "/avatars/alice.jpg",
//     },
//     lastModified: "2025-06-18",
//   },
//   {
//     id: "2",
//     fileName: "BudgetReport",
//     fileSize: '1.1 MB',
//     fileType: 'xlsx',
//     uploadedBy: {
//       name: "Bob Smith",
//       email: "bob@example.com",
//       avatarUrl: "/avatars/bob.jpg",
//     },
//     lastModified: "2025-06-17",
//   },
//   {
//     id: "3",
//     fileName: "Presentation",
//     fileSize: '3.5 MB',
//     fileType: 'pptx',
//     uploadedBy: {
//       name: "Carol White",
//       email: "carol@example.com",
//       avatarUrl: "/avatars/carol.jpg",
//     },
//     lastModified: "2025-06-15",
//   },
//   // ... add more rows if you want
// ]

// export default function FilesPage() {
//   const [globalFilter, setGlobalFilter] = useState("")
//   const [rows, setRows] = useState(data)

//   // Filter state for file types
//   const [filterOpen, setFilterOpen] = useState(false)
//   const [fileTypeFilter, setFileTypeFilter] = useState<string[]>([])

//   // Extract unique file types for filter options
//   const fileTypes = useMemo(() => {
//     const types = new Set(data.map(f => f.fileType))
//     return Array.from(types)
//   }, [])

//   // Apply filters and search
//   const filteredRows = useMemo(() => {
//     return data.filter(file => {
//       const matchesSearch = file.fileName.toLowerCase().includes(globalFilter.toLowerCase())
//       const matchesType =
//         fileTypeFilter.length === 0 || fileTypeFilter.includes(file.fileType)
//       return matchesSearch && matchesType
//     })
//   }, [globalFilter, fileTypeFilter])

//   const columns = useMemo<ColumnDef<File>[]>(() => [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
//           aria-label="Select all rows"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={row.getToggleSelectedHandler()}
//           aria-label={`Select row ${row.id}`}
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "fileName",
//       header: "File Name",
//       cell: ({ row }) => {
//         const { fileName, fileSize, fileType } = row.original
//         return (
//           <div className="flex items-center space-x-3">
//             {/* File icon */}
//             <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-gray-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M9 12h6m-6 4h6m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-5l-5 5v6a2 2 0 002 2z"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="font-medium">{fileName}</p>
//               <p className="text-xs text-muted-foreground">
//                 {fileSize} &bull; {fileType}
//               </p>
//             </div>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "uploadedBy",
//       header: "Uploaded By",
//       cell: ({ row }) => {
//         const u = row.original.uploadedBy
//         return (
//           <div className="flex items-center space-x-2">
//             <Image src={u.avatarUrl} alt={u.name} width={32} height={32} className="rounded-full" />
//             <div>
//               <p className="font-medium">{u.name}</p>
//               <p className="text-sm text-muted-foreground">{u.email}</p>
//             </div>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "lastModified",
//       header: "Last Modified",
//       cell: ({ row }) => <span>{row.original.lastModified}</span>,
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" aria-label="Open actions menu">
//               <MoreVertical />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onSelect={() => handleRename(row.original)}>Rename</DropdownMenuItem>
//             <DropdownMenuItem onSelect={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
//             <DropdownMenuItem onSelect={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ], [])

//   const table = useReactTable({
//     data: filteredRows,
//     columns,
//     state: { globalFilter },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     globalFilterFn: "containsString",
//   })

//   function handleRename(file: File) {
//     console.log("Rename", file)
//   }
//   function handleEdit(file: File) {
//     console.log("Edit", file)
//   }
//   function handleDelete(file: File) {
//     console.log("Delete", file)
//     setRows(prev => prev.filter(r => r.id !== file.id))
//   }

//   function toggleFileType(fileType: string) {
//     setFileTypeFilter(current => {
//       if (current.includes(fileType)) {
//         return current.filter(f => f !== fileType)
//       }
//       return [...current, fileType]
//     })
//   }

//   return (
//     <div className="p-4">
//       <div className="flex items-center space-x-2 mb-4 relative">
//         <Input
//           placeholder="Search files..."
//           value={globalFilter ?? ""}
//           onChange={e => setGlobalFilter(e.target.value)}
//           aria-label="Search files"
//           className="w-[300px]"
//         />
//         <Button
//           variant={filterOpen ? "default" : "outline"}
//           className="flex items-center space-x-1"
//           onClick={() => setFilterOpen(open => !open)}
//           aria-label="Toggle filter options"
//         >
//           <FilterIcon className="h-4 w-4" />
//           <span>Filter</span>
//         </Button>

//         {/* Filter dropdown */}
//         {filterOpen && (
//           <div className="absolute top-full left-[calc(100%_-_130px)] mt-2 w-48 p-3 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//             <p className="mb-2 font-semibold">Filter by File Type</p>
//             {fileTypes.map(type => (
//               <label
//                 key={type}
//                 className="flex items-center space-x-2 mb-1 cursor-pointer"
//               >
//                 <Checkbox
//                   checked={fileTypeFilter.includes(type)}
//                   onCheckedChange={() => toggleFileType(type)}
//                 />
//                 <span className="capitalize">{type}</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map(headerGroup => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map(header => (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(header.column.columnDef.header, header.getContext())}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>

//         <TableBody>
//           {table.getRowModel().rows.map(row => (
//             <TableRow key={row.id}>
//               {row.getVisibleCells().map(cell => (
//                 <TableCell key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <div className="flex items-center justify-between py-4">
//         <Button
//           variant="outline"
//           disabled={!table.getCanPreviousPage()}
//           onClick={() => table.previousPage()}
//         >
//           Previous
//         </Button>
//         <span>
//           Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
//         </span>
//         <Button
//           variant="outline"
//           disabled={!table.getCanNextPage()}
//           onClick={() => table.nextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   )
// }
