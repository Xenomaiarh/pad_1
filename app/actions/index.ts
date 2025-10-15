'use server'

import apiClient from "@/lib/api";

export async function deleteWishItem(id: string){
  apiClient.delete(`/api/wishlist/${id}`, {
    method: "DELETE",
  });
}