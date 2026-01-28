import { searchProducts } from "@/tools/searchProducts"
import { calculateOffer } from "@/tools/calculateOffer"

export async function execute(intent: any) {
  try {
    if (intent.type === "PRICE_OFFER") {
      const products = searchProducts(intent.productName)
      if (!products.length) return "Nie znalazłem produktu o nazwie: " + intent.productName

      const offer = calculateOffer({
        productId: products[0].id,
        quantity: intent.quantity,
        clientType: intent.clientType
      })

      return `
Oferta dla Ciebie:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Produkt: ${products[0].name}
Ilość: ${intent.quantity} m²
Typ klienta: ${intent.clientType}
Cena za jednostkę: ${products[0].price} zł
Cena końcowa: ${offer.total} zł
`
    }
    return "Nie mogę przetworzyć tego zapytania"
  } catch (error) {
    return `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
  }
}