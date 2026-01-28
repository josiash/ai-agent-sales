import { GoogleGenerativeAI } from "@google/generative-ai";

export async function plan(message: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log("planner - start, message preview:", message.slice(0, 500));
  console.log("planner - GOOGLE_API_KEY set?", !!apiKey);

  if (!apiKey) {
    throw new Error("Brak GOOGLE_API_KEY. Skonfiguruj .env.local");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // gemini-1.5-flash jest darmowy
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    apiVersion: "v1" // zmiana z v1beta na v1
  });

  const prompt = `
Jesteś asystentem do planowania ofert dla sprzedaży materiałów budowlanych.
Na podstawie wiadomości użytkownika wyekstraktuj:
1. Typ produktu/produktów (productName)
2. Ilość (quantity) - głównie jednostka metrów kwadratowych (m²) lub sztuk
3. Typ klienta (clientType): "B2B" lub "B2C"

Wiadomość użytkownika: "${message}"

Odpowiedz WYŁĄCZNIE w formacie JSON (bez dodatkowego tekstu):
{
  "type": "PRICE_OFFER",
  "productName": "nazwa produktu",
  "quantity": 100,
  "clientType": "B2B"
}
`;

  try {
    console.log("planner - sending prompt to Gemini (length):", prompt.length);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("planner - raw gemini response preview:", responseText.slice(0, 1500));

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("planner - nie znaleziono JSON w odpowiedzi:", responseText);
      throw new Error("Nie udało się sparsować odpowiedzi agenta");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.quantity === "string") {
      parsed.quantity = parseFloat(parsed.quantity);
    }

    console.log("planner - parsed intent:", parsed);
    return parsed;
  } catch (err) {
    console.error("planner - error calling Gemini:", err);
    throw err instanceof Error ? err : new Error("Błąd podczas analizy wiadomości");
  }
}