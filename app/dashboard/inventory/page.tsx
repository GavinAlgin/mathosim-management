"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileVolume, PlusIcon } from 'lucide-react';
import InventoryTable from './data-table.tsx/inventoryTable';
import { Input } from '@/components/ui/input';
import { InventoryItem } from '@/hooks/types';

const Inventorypage = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Inventory Management</h2>
          <p className="text-[14px] text-gray-500">
            Insert, View and manage equipments with easy search, filter, and bulk action options.
          </p>
        </div>

        <div className="flex flex-row xs:flex-row gap-2">
          <Button className="border bg-transparent hover:bg-[#f7f7f7] text-black cursor-pointer">
            <FileVolume />
            Export
          </Button>
          <Button className='cursor-pointer' onClick={() => setIsSidePanelOpen(true)}>
            <PlusIcon />
            Add Inventory
          </Button>
        </div>
      </div>
      <Separator className="mt-4" />

      <InventoryTable />

      {/* ✅ Side Panel */}
      {isSidePanelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidePanelOpen(false)}
          />

          {/* Panel */}
          <div className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Inventory Item</h2>
            
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const formData = new FormData(form)
                const newItem: InventoryItem = {
                  id: Date.now().toString(),
                  itemName: formData.get('itemName') as string,
                  modelNum: formData.get('modelNum') as string,
                  operator: formData.get('operator') as string,
                  date: formData.get('date') as string,
                  quantity: Number(formData.get('quantity')),
                  status: formData.get('status') as string,
                  details: formData.get('details') as string || ''
                }
                setData(prev => [newItem, ...prev])
                setIsSidePanelOpen(false)
              }}
              className="space-y-4">
              <Input name="itemName" placeholder="Item Name" required />
              <Input name="modelNum" placeholder="Model Number" required />
              <Input name="operator" placeholder="Operator" required />
              <Input name="date" type="date" required />
              <Input name="quantity" type="number" placeholder="Quantity" required />
              <select name="status" required className="w-full border rounded px-3 py-2">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="pending">Pending</option>
                <option value="In-active">In-active</option>
              </select>
              <textarea
                name="details"
                placeholder="Additional details (optional)"
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-between mt-4">
                <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                  Add Item
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsSidePanelOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventorypage;
