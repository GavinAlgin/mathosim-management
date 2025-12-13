import { supabase } from "@/lib/supabaseClient";
import { InventoryItem } from "@/hooks/types";

export async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    itemName: item.item_name,
    modelNum: item.model_num,
    operator: item.operator,
    date: item.date,
    quantity: item.quantity,
    status: item.status,
    details: item.details,
    created_at: item.created_at
  }));
}

// Insert Item
export async function addInventory(item: InventoryItem) {
  const { error } = await supabase.from("inventory").insert({
    item_name: item.itemName,
    model_num: item.modelNum,
    operator: item.operator,
    date: item.date,
    quantity: item.quantity,
    status: item.status,
    details: item.details
  });

  if (error) throw error;
}

// Update Item 
export async function updateInventory(item: InventoryItem) {
  const { error } = await supabase
    .from("inventory")
    .update({
      item_name: item.itemName,
      model_num: item.modelNum,
      operator: item.operator,
      date: item.date,
      quantity: item.quantity,
      status: item.status,
      details: item.details
    })
    .eq("id", item.id);

  if (error) throw error;
}

// Delete Item 
export async function deleteInventory(id: string) {
  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Delete Many Items
export async function deleteManyInventory(ids: string[]) {
  const { error } = await supabase
    .from("inventory")
    .delete()
    .in("id", ids);

  if (error) throw error;
}

