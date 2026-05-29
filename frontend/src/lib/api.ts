/// <reference types="vite/client" />

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface EvalResult {
  result: string;
  expression: string;
}

export async function evaluateExpression(expression: string): Promise<EvalResult> {
  const response = await fetch(`${API_BASE}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Server error' }));
    throw new Error(err.message || 'Failed to evaluate');
  }
  return response.json();
}