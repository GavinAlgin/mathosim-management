// app/employees/add-employee-panel.tsx

'use client'

import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type AddEmployeePanelProps = {
  onAdd: (employee: { name: string; email: string; role: string }) => void
}

export const AddEmployeePanel = ({ onAdd }: AddEmployeePanelProps) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const handleAdd = () => {
    if (!name || !email || !role) return
    onAdd({ name, email, role })
    setName('')
    setEmail('')
    setRole('')
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="cursor-pointer">
          <span className="mr-2">+</span> Add Employee
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add New Employee</h2>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <Button onClick={handleAdd}>Submit</Button>
      </DrawerContent>
    </Drawer>
  )
}
