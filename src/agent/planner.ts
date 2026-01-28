import { GoogleGenAI } from "@google/genai";

export async function plan(message: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("planner - start, message preview:", message.slice(0, 500));
  console.log("planner - GOOGLE_API_KEY set?", !!apiKey);

  if (!apiKey) {
    throw new Error("Brak GOOGLE_API_KEY. Skonfiguruj .env.local");
  }

  const genAI = new GoogleGenAI({
    apiKey: apiKey,
  });

  const prompt = `
Jesteś asystentem do planowania ofert dla sprzedaży materiałów budowlanych.
Na podstawie wiadomości użytkownika wyekstraktuj WSZYSTKIE produkty:
1. Typ produktu/produktów (productName)
2. Ilość (quantity) - głównie jednostka metrów kwadratowych (m²), m³ lub sztuk
3. Typ klienta (clientType): "B2B" lub "B2C"

Wiadomość użytkownika: "${message}"

Odpowiedz WYŁĄCZNIE w formacie JSON (tablica obiektów, bez dodatkowego tekstu):
[
  {
    "type": "PRICE_OFFER",
    "productName": "nazwa produktu",
    "quantity": 100,
    "clientType": "B2B"
  }
]
`;

  try {
    console.log("planner - sending prompt to Gemini (length):", prompt.length);
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const responseText = response.text;
    console.log("planner - raw gemini response preview:", responseText.slice(0, 1500));

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("planner - nie znaleziono JSON w odpowiedzi:", responseText);
      throw new Error("Nie udało się sparsować odpowiedzi agenta");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Upewnij się, że to tablica
    const items = Array.isArray(parsed) ? parsed : [parsed];
    
    // Konwertuj quantity na liczby
    items.forEach((item: any) => {
      if (typeof item.quantity === "string") {
        item.quantity = parseFloat(item.quantity.match(/\d+(\.\d+)?/)?.[0] || "0");
      }
    });

    console.log("planner - parsed intents:", items);
    return items;
  } catch (err) {
    console.error("planner - error calling Gemini:", err);
    throw err instanceof Error ? err : new Error("Błąd podczas analizy wiadomości");
  }
}