import { searchProducts } from "@/tools/searchProducts"
import { calculateOffer } from "@/tools/calculateOffer"

export async function execute(intent: any) {
  if (intent.type === "PRICE_OFFER") {
    const products = searchProducts(intent.productName)
    if (!products.length) return "Nie znalazłem produktu"

    const offer = calculateOffer({
      productId: products[0].id,
      quantity: intent.quantity,
      clientType: intent.clientType
    })

    return `
Oferta:
Produkt: ${products[0].name}
Cena końcowa: ${offer.total} zł
`
  }
}
