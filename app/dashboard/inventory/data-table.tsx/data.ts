import { InventoryItem } from '@/hooks/types'

export const inventoryData: InventoryItem[] = [
  {
    id: '1',
    itemName: 'Drill Machine',
    modelNum: 'DM-2023',
    operator: 'Anthonia Construction',
    date: '2025-08-08',
    quantity: '2',
    status: 'In-active',
    details: 'Used for masonry drilling.'
  },
  {
    id: '2',
    itemName: 'Roller Machine',
    modelNum: 'DM-2023',
    operator: 'Mathosim',
    date: '2025-08-08',
    quantity: '4',
    status: 'Active',
    details: 'Used for masonry drilling.'
  },
  // Add more items...
]
