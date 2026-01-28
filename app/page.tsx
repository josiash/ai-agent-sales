'use client';

import { useState } from 'react';

interface AgentResponse {
  result: string;
  error?: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        result: '',
        error: 'Błąd połączenia z agentem',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doradca Sprzedaży Materiałów Budowlanych
          </h1>
          <p className="text-gray-600 mb-6">
            Opisz swoje potrzeby, a my przygotujemy dla Ciebie ofertę
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Twoja zapytanie:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Np. Potrzebuję 120 m² styropianu do ocieplenia domu. Jestem klientem B2B."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Przetwarzanie...' : 'Wyślij zapytanie'}
            </button>
          </form>

          {response && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-indigo-600">
              {response.error ? (
                <div className="text-red-600 font-semibold">{response.error}</div>
              ) : (
                <div className="text-gray-900 whitespace-pre-wrap font-mono text-sm">
                  {response.result}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}