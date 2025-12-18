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
import { Employee } from "../types"
import { supabase } from "@/lib/supabaseClient"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  employee: Employee
  onUpdated: () => void
}

export function EmployeeActions({ employee, onUpdated }: Props) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: employee.name,
    arrangement: employee.arrangement,
    number: employee.number,
    position: employee.position,
  })

  /* ---------------- Copy Phone ---------------- */

  const copyPhone = async () => {
    await navigator.clipboard.writeText(employee.number)
    toast.success("Phone number copied")
  }

  /* ---------------- Update Employee ---------------- */

  const updateEmployee = async () => {
    setLoading(true)

    const { error } = await supabase
      .from("employees")
      .update(form)
      .eq("id", employee.id)

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Employee updated")
    setEditOpen(false)
    onUpdated()
  }

  /* ---------------- Delete Employee ---------------- */

  const deleteEmployee = async () => {
    setLoading(true)

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", employee.id)

    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Employee deleted")
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

          <DropdownMenuItem onClick={copyPhone}>
            <Copy className="mr-2 h-4 w-4" />
            Copy phone
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
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />
            <Select
            value={form.arrangement}
            onValueChange={(value) =>
                setForm({
                ...form,
                arrangement: value as Employee["arrangement"],
                })
            }
            >
            <SelectTrigger>
                <SelectValue placeholder="Arrangement" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
            </Select>
            <Input
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="Phone"
            />
            <Input
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              placeholder="Role"
            />

            <Button
              onClick={updateEmployee}
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
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2">
            <AlertDialogCancel disabled={loading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEmployee}
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
