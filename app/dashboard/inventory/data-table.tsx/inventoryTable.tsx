"use client";

import React, { useEffect, useState } from "react";
import { InventoryItem } from "@/hooks/types";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { inventoryColumns } from "../columns";

const DraggableRow = ({ row, children }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </TableRow>
  );
};

type InventoryDataTableProps = {
  data: InventoryItem[];
};

export function InventoryDataTable({ data }: InventoryDataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableData, setTableData] = useState<InventoryItem[]>([]);

  useEffect(() => setTableData(data), [data]);

  const table = useReactTable({
    data: tableData,
    columns: inventoryColumns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTableData((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search items..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-[150px] mt-8"
      />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={table.getRowModel().rows.map((row) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </DraggableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={inventoryColumns.length} className="text-center h-24">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeftIcon className="mr-2" />
          Previous
        </Button>
        <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ArrowRightIcon className="ml-2" />
        </Button>
      </div>
    </div>
  );
}


// 'use client'

// import React, { useState } from 'react'
// import { InventoryItem } from '@/hooks/types'
// import { RowActions } from '@/components/custom-rowactions'
// import { ExpandRow } from '@/components/custom-expandrow'
// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { RefreshCcwIcon } from 'lucide-react'
// import { deleteManyInventory, getInventory } from './inventory'

// interface InventoryTableProps {
//   data: InventoryItem[];
//   setData: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
//   onEdit: (item: InventoryItem) => void;
// }

// export default function InventoryTable({ data, setData, onEdit }: InventoryTableProps) {
//   const [expandedRow, setExpandedRow] = useState<string | null>(null)
//   const [selected, setSelected] = useState<Set<string>>(new Set())
//   const [searchQuery, setSearchQuery] = useState('')

//   const toggleRow = (id: string) => {
//     setExpandedRow(prev => (prev === id ? null : id))
//   }

//   const toggleSelectRow = (id: string) => {
//     setSelected(prev => {
//       const newSet = new Set(prev)
//       newSet.has(id) ? newSet.delete(id) : newSet.add(id)
//       return newSet
//     })
//   }

//   const isSelected = (id: string) => selected.has(id)

//   const handleDeleteSelected = async () => {
//     if (selected.size === 0) return
//     const confirmed = confirm(`Delete ${selected.size} selected item(s)?`)
//     if (confirmed) {
//       setData(prev => prev.filter(item => !selected.has(item.id)))
//       setSelected(new Set())
//       await deleteManyInventory(Array.from(selected));
//       setData(await getInventory());
//     }
//   }

//   const filteredData = data.filter(item =>
//     item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
//   )


//   const handleRefresh = () => {
//     setSearchQuery('')
//     setSelected(new Set())
//     setExpandedRow(null)
//   }

//   return (
//     <>
//       {/* HEADER */}
//       <header className="w-full px-4 py-3 bg-white dark:bg-gray-950">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

//           <div className="text-lg font-medium">
//             Total Items: <span className="font-bold">{filteredData.length}</span>
//           </div>

//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
//             <Input
//               type="text"
//               placeholder="Search items..."
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full sm:w-64"
//             />
//             <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh}>
//               <RefreshCcwIcon className="w-4 h-4" /> Refresh
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDeleteSelected}
//               disabled={selected.size === 0}>
//               Delete Selected
//             </Button>
//           </div>

//         </div>
//       </header>

//       {/* TABLE */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2">
//                 <input
//                   type="checkbox"
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelected(new Set(filteredData.map(i => i.id)))
//                     } else {
//                       setSelected(new Set())
//                     }
//                   }}
//                   checked={selected.size > 0 && selected.size === filteredData.length}
//                   className="w-4 h-4"
//                 />
//               </th>
//               <th className="px-4 py-2 text-left">Item Name</th>
//               <th className="px-4 py-2 text-left">Model Num</th>
//               <th className="px-4 py-2 text-left">Operator</th>
//               <th className="px-4 py-2 text-left">Date</th>
//               <th className="px-4 py-2 text-left">Quantity</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//               <th className="px-4 py-2"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredData.map((item) => (
//               <React.Fragment key={item.id}>
//                 <tr className="border-b hover:bg-muted/50 transition-colors">
//                   <td className="px-4 py-2">
//                     <input
//                       type="checkbox"
//                       checked={isSelected(item.id)}
//                       onChange={() => toggleSelectRow(item.id)}
//                       className="w-4 h-4"
//                     />
//                   </td>
//                   <td className="px-4 py-2">{item.itemName}</td>
//                   <td className="px-4 py-2">{item.modelNum}</td>
//                   <td className="px-4 py-2">{item.operator}</td>
//                   <td className="px-4 py-2">{item.date}</td>
//                   <td className="px-4 py-2">{item.quantity}</td>
//                   <td className="px-4 py-2">
//                     <span
//                       className={cn("px-2 py-1 rounded text-xs font-medium", {
//                         "bg-green-100 text-green-800": item.status === "Active",
//                         "bg-yellow-100 text-yellow-800": item.status === "pending",
//                         "bg-red-100 text-red-800": item.status === "In-active",
//                       })}>
//                       {item.status}
//                     </span>
//                   </td>

//                   <td className="px-2 py-2">
//                     <RowActions
//                       onEdit={() => onEdit(item)}
//                       onShare={() => alert(`Share ${item.itemName}`)}
//                       onPrint={() => alert(`Print ${item.itemName}`)}
//                     />
//                   </td>

//                   <td className="px-2 py-2 text-right">
//                     <ExpandRow
//                       isOpen={expandedRow === item.id}
//                       onClick={() => toggleRow(item.id)}
//                     />
//                   </td>
//                 </tr>

//                 {expandedRow === item.id && (
//                   <tr className="bg-gray-50">
//                     <td colSpan={8} className="px-4 py-4 text-gray-700">
//                       <strong>Details:</strong> {item.details || 'No additional information.'}
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>

//         </table>
//       </div>
//     </>
//   )
// }
