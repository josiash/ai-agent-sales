import { searchProducts } from "@/tools/searchProducts"
import { calculateOffer } from "@/tools/calculateOffer"

export async function execute(intents: any[]) {
  try {
    if (!Array.isArray(intents)) {
      intents = [intents];
    }

    let totalPrice = 0;
    let offerDetails = "Oferta dla Ciebie:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

    for (const intent of intents) {
      if (intent.type === "PRICE_OFFER") {
        const products = searchProducts(intent.productName);
        if (!products.length) {
          offerDetails += `❌ Nie znalazłem produktu: ${intent.productName}\n`;
          continue;
        }

        const offer = calculateOffer({
          productId: products[0].id,
          quantity: intent.quantity,
          clientType: intent.clientType
        });

        totalPrice += offer.total;
        offerDetails += `\n✓ ${products[0].name}
  Ilość: ${intent.quantity} ${intent.productName.includes("m³") ? "m³" : intent.productName.includes("sztuk") ? "szt" : "m²"}
  Cena za jednostkę: ${products[0].pricePerM2} zł
  Rabat B2B: ${offer.discountApplied * 100}%
  Cena netto: ${offer.total} zł
`;
      }
    }

    offerDetails += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAZEM: ${totalPrice} zł`;

    return offerDetails;
  } catch (error) {
    return `Błąd: ${error instanceof Error ? error.message : "Nieznany błąd"}`;
  }
}