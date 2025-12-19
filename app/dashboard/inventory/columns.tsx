import { InventoryItem } from "@/hooks/types";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryActions } from "./components/InventoryActions";

export const inventoryColumns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "itemName",
    header: "Item Name",
  },
  {
    accessorKey: "modelNum",
    header: "Model Number",
  },
  {
    accessorKey: "operator",
    header: "Operator",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const colors: Record<InventoryItem["status"], string> = {
        Active: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        "In-active": "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            colors[status] ?? "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <InventoryActions
        item={row.original}
        onUpdated={() => {
          // Add table refresh logic here if needed
        }}
      />
    ),
  },
];



// // components/data-table.tsx/inventoryColumns.ts
// import { ColumnDef } from "@tanstack/react-table";
// import { InventoryItem } from "@/hooks/types";

// export const inventoryColumns: ColumnDef<InventoryItem>[] = [
//   {
//     accessorKey: "itemName",
//     header: "Item Name",
//   },
//   {
//     accessorKey: "modelNum",
//     header: "Model Number",
//   },
//   {
//     accessorKey: "operator",
//     header: "Operator",
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//   },
//   {
//     accessorKey: "quantity",
//     header: "Quantity",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.original.status;
//       const colors = {
//         Active: "bg-green-100 text-green-800",
//         Pending: "bg-yellow-100 text-yellow-800",
//         "In-active": "bg-red-100 text-red-800",
//       };
//       return (
//         <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
//           {status}
//         </span>
//       );
//     },
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <button
//         onClick={() => alert(`Edit ${row.original.itemName}`)}
//         className="text-blue-600 hover:underline">
//         Edit
//       </button>
//     ),
//   },
// ];
