export type Operator = '+' | '-' | '×' | '÷' | null;

export type Theme = 'dark' | 'light';

export interface CalculatorState {
  display: string;
  expression: string;
  operator: Operator;
  previousValue: string;
  waitingForOperand: boolean;
  hasResult: boolean;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'equals' | 'zero';

export interface ButtonConfig {
  label: string;
  type: ButtonType;
  action: string;
  wide?: boolean;
}