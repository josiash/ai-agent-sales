type Input = {
  productId: string
  quantity: number
  clientType: "B2B" | "B2C"
}

import { products } from "@/db/products"

export function calculateOffer(input: Input) {
  const product = products.find(p => p.id === input.productId)
  if (!product) throw new Error("Product not found")

  const base = product.pricePerM2 * input.quantity
  const discount = input.clientType === "B2B" ? 0.1 : 0

  return {
    total: base * (1 - discount),
    discountApplied: discount
  }
}
