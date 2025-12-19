"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { MoreHorizontal, Pencil, Trash, Copy } from "lucide-react"
import { InventoryItem } from "@/hooks/types"
import { supabase } from "@/lib/supabaseClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  item: InventoryItem
  onUpdated: () => void
}

export function InventoryActions({ item, onUpdated }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    itemName: item.itemName,
    modelNum: item.modelNum,
    operator: item.operator,
    date: item.date,
    quantity: item.quantity,
    status: item.status,
    details: item.details,
  })

  /* ---------------- Copy Model Number ---------------- */
  const copyModelNum = async () => {
    await navigator.clipboard.writeText(item.modelNum)
    toast.success("Model number copied")
  }

  /* ---------------- Update Inventory ---------------- */
  const updateInventory = async () => {
    setLoading(true)

    const { error } = await supabase
      .from("inventory")
      .update({
        item_name: form.itemName,
        model_num: form.modelNum,
        operator: form.operator,
        date: form.date,
        quantity: form.quantity,
        status: form.status,
        details: form.details,
      })
      .eq("id", item.id)

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Inventory updated")
    setEditOpen(false)
    onUpdated()
  }

  /* ---------------- Delete Inventory ---------------- */
  const deleteInventory = async () => {
    setLoading(true)

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", item.id)

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Inventory deleted")
    setDeleteOpen(false)
    onUpdated()
  }

  return (
    <>
      {/* ---------- Action Menu ---------- */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={copyModelNum}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Model
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ---------- Edit Modal ---------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              placeholder="Item Name"
            />
            <Input
              value={form.modelNum}
              onChange={(e) => setForm({ ...form, modelNum: e.target.value })}
              placeholder="Model Number"
            />
            <Input
              value={form.operator}
              onChange={(e) => setForm({ ...form, operator: e.target.value })}
              placeholder="Operator"
            />
            <Input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="Date"
              type="date"
            />
            <Input
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              placeholder="Quantity"
              type="number"
            />
            <Select
                value={form.status}
                onValueChange={(value) =>
                    setForm({
                    ...form,
                    status: value as InventoryItem["status"], // type assertion
                    })
                }
                >
                <SelectTrigger>
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="In-active">In-active</SelectItem>
                </SelectContent>
            </Select>
            <Input
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Details"
            />

            <Button
              onClick={updateInventory}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- Delete Dialog ---------- */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete inventory item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteInventory}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
