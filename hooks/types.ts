export type InventoryItem = {
  id: string
  itemName: string
  modelNum: string
  operator: string
  date: string
  quantity: string
  status: 'In-active' | 'Active' | 'pending'
  details?: string
}
