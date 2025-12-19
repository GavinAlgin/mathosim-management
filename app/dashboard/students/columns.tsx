import { ColumnDef } from "@tanstack/react-table";
import { Student } from "./types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const ActionMenu = ({ student }: { student: Student }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <DotsHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => console.log("Edit", student)}>Edit</DropdownMenuItem>
      <DropdownMenuItem onClick={() => console.log("Delete", student)}>Delete</DropdownMenuItem>
      <DropdownMenuItem onClick={() => console.log("Copy", student)}>Copy Account</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">{row.original.number}</div>
      </div>
    ),
  },
  { accessorKey: "position", header: "Position" },
  {
    accessorKey: "arrangement",
    header: "Arrangement",
    cell: ({ getValue }) => <span className="capitalize">{getValue() as string}</span>,
  },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "startDate", header: "Start Date" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionMenu student={row.original} />,
  },
];



// // components/columns.ts
// import { ColumnDef } from "@tanstack/react-table"
// import { Student } from "./types"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { DotsHorizontalIcon } from "@radix-ui/react-icons"

// const ActionMenu = ({ student }: { student: Student }) => (
//   <DropdownMenu>
//     <DropdownMenuTrigger asChild={true}>
//       <Button variant="ghost" size="icon">
//         <DotsHorizontalIcon />
//       </Button>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent>
//       <DropdownMenuItem onClick={() => console.log("Edit", student)}>Edit</DropdownMenuItem>
//       <DropdownMenuItem onClick={() => console.log("Delete", student)}>Delete</DropdownMenuItem>
//       <DropdownMenuItem onClick={() => console.log("Copy", student)}>Copy Account</DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>
// )

// export const columns: ColumnDef<Student>[] = [
//   {
//     accessorKey: "name",
//     header: "Student Name",
//     cell: ({ row }) => (
//       <div>
//         <div className="font-medium">{row.original.name}</div>
//         <div className="text-sm text-muted-foreground">{row.original.number}</div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "position",
//     header: "Position",
//   },
//   {
//     accessorKey: "arrangement",
//     header: "Arrangement",
//     cell: ({ getValue }) => (
//       <span className="capitalize">{getValue() as string}</span>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "startDate",
//     header: "Start Date",
//   },
//   {
//     id: "actions",
//     header: "",
//     cell: ({ row }) => <ActionMenu student={row.original} />,
//   },
// ]
