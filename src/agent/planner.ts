export function plan(message: string) {
  return {
    type: "PRICE_OFFER",
    productName: "Styropian",
    quantity: 120,
    clientType: "B2B"
  }
}
