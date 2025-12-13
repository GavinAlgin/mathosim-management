export interface InventoryItem {
  id: string;               // uuid from Supabase
  itemName: string;
  modelNum: string;
  operator: string;
  date: string;             // YYYY-MM-DD
  quantity: number;
  status: "Active" | "pending" | "In-active";
  details?: string;
  created_at?: string;
}
