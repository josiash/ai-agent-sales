import { products } from "@/db/products"

export function searchProducts(query: string) {
  return products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )
}
