"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { InventoryItem } from "@/hooks/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface InventoryFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  editingItem?: InventoryItem | null;
}

const InventoryFormDrawer: React.FC<InventoryFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem = null,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset scroll to top when drawer opens
    if (isOpen) window.scrollTo(0, 0);
  }, [isOpen]);

  if (!isOpen) return null;

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const form = e.target as HTMLFormElement;
  //   const formData = new FormData(form);

  //   const newItem: InventoryItem = {
  //     id: editingItem ? editingItem.id : Date.now().toString(),
  //     itemName: formData.get("itemName") as string,
  //     modelNum: formData.get("modelNum") as string,
  //     operator: formData.get("operator") as string,
  //     date: formData.get("date") as string,
  //     quantity: Number(formData.get("quantity")),
  //     status: formData.get("status") as string,
  //     details: (formData.get("details") as string) || "",
  //   };

  //   onSave(newItem);
  //   toast.success(editingItem ? "Item updated!" : "Item added!");
  //   setLoading(false);
  //   form.reset();
  //   onClose();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      item_name: formData.get("itemName"),
      model_num: formData.get("modelNum"),
      operator: formData.get("operator"),
      date: formData.get("date"),
      quantity: Number(formData.get("quantity")),
      status: formData.get("status"),
      details: formData.get("details") || "",
    };

    try {
      if (editingItem) {
        // 🔄 UPDATE
        const { error } = await supabase
          .from("inventory")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) throw error;

        toast.success("Item updated!");
      } else {
        // ➕ INSERT
        const { error } = await supabase
          .from("inventory")
          .insert(payload);

        if (error) throw error;

        toast.success("Item added!");
      }

      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="itemName"
            placeholder="Item Name"
            defaultValue={editingItem?.itemName}
            required
          />
          <Input
            name="modelNum"
            placeholder="Model Number"
            defaultValue={editingItem?.modelNum}
            required
          />
          <Input
            name="operator"
            placeholder="Operator"
            defaultValue={editingItem?.operator}
            required
          />
          <Input
            name="date"
            type="date"
            defaultValue={editingItem?.date}
            required
          />
          <Input
            name="quantity"
            type="number"
            placeholder="Quantity"
            defaultValue={editingItem?.quantity}
            required
          />

          <select
            name="status"
            defaultValue={editingItem?.status || ""}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="In-active">In-active</option>
          </select>

          <textarea
            name="details"
            placeholder="Additional details (optional)"
            defaultValue={editingItem?.details}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-between mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Save Inventory"}
            </Button>

            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryFormDrawer;
