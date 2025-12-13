"use client"

import { Separator } from "@radix-ui/react-separator";
import { FileVolume, Loader2, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/hooks/types";
import { useState, useEffect } from "react";
import { getInventory } from "./data-table.tsx/inventory";
import InventoryFormDrawer from "./components/SideDrawer";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { InventoryDataTable } from "./data-table.tsx/inventoryTable";

const Inventorypage = () => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [data, setData] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  /** Check logged in user sessions */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    async function load() {
      const items = await getInventory();
      setData(items);
    }
    load();
  }, []);

  const handleSave = (item: InventoryItem) => {
    if (editingItem) {
      setData(prev => prev.map(i => (i.id === editingItem.id ? item : i)));
    } else {
      setData(prev => [item, ...prev]);
    }
    setEditingItem(null);
  };

  if (checkingAuth) {
    return (    
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
    )
  }

  return (
    <div className="container mx-auto py-5">
      {/* Header */}
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Inventory Management</h2>
          <p className="text-[16px] text-gray-500">
            Insert, View and manage equipments with easy search, filter, and bulk action options.
          </p>
        </div>

        <div className="flex flex-row xs:flex-row gap-2">
          <Button className="border bg-transparent hover:bg-[#f7f7f7] text-black cursor-pointer">
            <FileVolume />
            Export
          </Button>

          <Button className="cursor-pointer" onClick={() => setIsSidePanelOpen(true)}>
            <PlusIcon />
            Add Inventory
          </Button>
        </div>
      </div>

      <Separator className="mt-4 border" />

      <InventoryDataTable data={data}/>

      <InventoryFormDrawer
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
      />
    </div>
  );
};

export default Inventorypage;

// "use client";

// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { FileVolume, Loader2, PlusIcon } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { InventoryItem } from "@/hooks/types";
// import { toast } from "sonner";
// import InventoryTable from "./data-table.tsx/inventoryTable";
// import { addInventory, getInventory } from "./data-table.tsx/inventory";

// const Inventorypage = () => {
//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<InventoryItem[]>([]);
//   const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

//   useEffect(() => {
//     async function load() {
//       const items = await getInventory();
//       setData(items);
//     }
//     load();
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = e.target as HTMLFormElement;
//     const formData = new FormData(form);

//     const newItem: InventoryItem = {
//       id: editingItem ? editingItem.id : Date.now().toString(),
//       itemName: formData.get("itemName") as string,
//       modelNum: formData.get("modelNum") as string,
//       operator: formData.get("operator") as string,
//       date: formData.get("date") as string,
//       quantity: Number(formData.get("quantity")),
//       status: formData.get("status") as string,
//       details: (formData.get("details") as string) || "",
//     };

//     if (editingItem) {
//       // UPDATE
//       setData(prev =>
//         prev.map(item => (item.id === editingItem.id ? newItem : item))
//       );
//       toast.success("Item updated!");
//     } else {
//       // ADD NEW
//       setData(prev => [newItem, ...prev]);
//       toast.success("Item added!");
//     }

//     setEditingItem(null);
//     setIsSidePanelOpen(false);
//     setLoading(false);
//     form.reset();
//   };

//   return (
//     <div className="container mx-auto py-5">
//       <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
//         <div className="flex-1">
//           <h2 className="text-xl font-semibold">Inventory Management</h2>
//           <p className="text-[14px] text-gray-500">
//             Insert, View and manage equipments with easy search, filter, and bulk action options.
//           </p>
//         </div>

//         <div className="flex flex-row xs:flex-row gap-2">
//           <Button className="border bg-transparent hover:bg-[#f7f7f7] text-black cursor-pointer">
//             <FileVolume />
//             Export
//           </Button>

//           <Button className="cursor-pointer" onClick={() => setIsSidePanelOpen(true)}>
//             <PlusIcon />
//             Add Inventory
//           </Button>
//         </div>
//       </div>

//       <Separator className="mt-4" />

//       {/* Pass Data to table */}
//       <InventoryTable
//         data={data}
//         setData={setData}
//         onEdit={(item) => {
//           setEditingItem(item);
//           setIsSidePanelOpen(true);
//         }}
//       />

//       {/* Side Panel */}
//       {isSidePanelOpen && (
//         <div className="fixed inset-0 z-50 flex">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/50"
//             onClick={() => setIsSidePanelOpen(false)}
//           />

//           {/* Panel */}
//           <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4">Add New Inventory Item</h2>

//             <form onSubmit={handleSubmit}
//               className="space-y-4">
//               <Input name="itemName" placeholder="Item Name" required />
//               <Input name="modelNum" placeholder="Model Number" required />
//               <Input name="operator" placeholder="Operator" required />
//               <Input name="date" type="date" required />
//               <Input name="quantity" type="number" placeholder="Quantity" required />

//               <select
//                 name="status"
//                 required
//                 className="w-full border rounded px-3 py-2">
//                 <option value="">Select Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Pending">Pending</option>
//                 <option value="In-active">In-active</option>
//               </select>

//               <textarea
//                 name="details"
//                 placeholder="Additional details (optional)"
//                 className="w-full border rounded px-3 py-2"
//               />

//               <div className="flex justify-between mt-4">
//                 <Button type="submit" disabled={loading}>
//                   {loading ? <Loader2 className="animate-spin" /> : "Save Inventory"}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsSidePanelOpen(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventorypage;
