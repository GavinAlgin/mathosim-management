// components/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Employee } from "./types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient"

const ActionMenu = ({ employee }: { employee: Employee }) => {
  const handleDelete = async () => {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", employee.id);

    if (error) {
      toast.error("Failed to delete employee.");
    } else {
      toast.success("Employee deleted.");
      // Optional: trigger refetch, or lift a callback from parent
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(employee.number);
      toast.success("Phone number copied!");
    } catch {
      toast.error("Failed to copy number.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => console.log("Edit", employee)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>Copy Phone</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// const ActionMenu = ({ employee }: { employee: Employee }) => (
//   <DropdownMenu>
//     <DropdownMenuTrigger asChild={true}>
//       <Button variant="ghost" size="icon">
//         <DotsHorizontalIcon />
//       </Button>
//     </DropdownMenuTrigger>
//     <DropdownMenuContent>
//       <DropdownMenuItem onClick={() => console.log("Edit", employee)}>Edit</DropdownMenuItem>
//       <DropdownMenuItem onClick={() => console.log("Delete", employee)}>Delete</DropdownMenuItem>
//       <DropdownMenuItem onClick={() => console.log("Copy", employee)}>Copy Account</DropdownMenuItem>
//     </DropdownMenuContent>
//   </DropdownMenu>
// )

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Employee Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">{row.original.number}</div>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "arrangement",
    header: "Arrangement",
    cell: ({ getValue }) => (
      <span className="capitalize">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionMenu employee={row.original} />,
  },
]
