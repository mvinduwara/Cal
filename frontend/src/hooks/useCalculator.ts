import { useReducer, useCallback } from 'react';
import type { CalculatorState, Operator } from '../types';

type Action =
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_OPERATOR'; operator: Operator }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENTAGE' }
  | { type: 'BACKSPACE' };

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  operator: null,
  previousValue: '',
  waitingForOperand: false,
  hasResult: false,
};

function formatResult(result: number): string {
  if (!isFinite(result)) return 'Error';
  const abs = Math.abs(result);
  if (abs >= 1e13 || (abs < 1e-7 && abs > 0)) {
    return result.toExponential(6);
  }
  const str = parseFloat(result.toPrecision(12)).toString();
  return str;
}

function calculate(a: string, b: string, op: Operator): string {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) return 'Error';
  switch (op) {
    case '+': return formatResult(numA + numB);
    case '-': return formatResult(numA - numB);
    case '×': return formatResult(numA * numB);
    case '÷':
      if (numB === 0) return 'Error';
      return formatResult(numA / numB);
    default: return b;
  }
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT': {
      const { digit } = action;
      if (state.waitingForOperand || state.hasResult) {
        return {
          ...state,
          display: digit,
          waitingForOperand: false,
          hasResult: false,
          expression: state.hasResult ? '' : state.expression,
        };
      }
      if (state.display === '0' && digit !== '.') return { ...state, display: digit };
      if (state.display.replace('-', '').replace('.', '').length >= 12) return state;
      return { ...state, display: state.display + digit };
    }
    case 'INPUT_DECIMAL': {
      if (state.waitingForOperand) return { ...state, display: '0.', waitingForOperand: false };
      if (state.display.includes('.')) return state;
      return { ...state, display: state.display + '.' };
    }
    case 'INPUT_OPERATOR': {
      const { operator } = action;
      if (state.operator && !state.waitingForOperand) {
        const result = calculate(state.previousValue, state.display, state.operator);
        if (result === 'Error') return { ...initialState, display: 'Error', expression: 'Error' };
        return {
          ...state,
          display: result,
          previousValue: result,
          operator,
          waitingForOperand: true,
          expression: `${result} ${operator}`,
          hasResult: false,
        };
      }
      return {
        ...state,
        operator,
        previousValue: state.display,
        waitingForOperand: true,
        expression: `${state.display} ${operator}`,
        hasResult: false,
      };
    }
    case 'CALCULATE': {
      if (!state.operator || state.waitingForOperand) return state;
      const result = calculate(state.previousValue, state.display, state.operator);
      const expr = `${state.previousValue} ${state.operator} ${state.display}`;
      if (result === 'Error') return { ...initialState, display: 'Error', expression: 'Cannot divide by zero' };
      return { ...initialState, display: result, expression: `${expr} =`, hasResult: true };
    }
    case 'CLEAR': return { ...initialState };
    case 'TOGGLE_SIGN': {
      if (state.display === '0' || state.display === 'Error') return state;
      const toggled = state.display.startsWith('-') ? state.display.slice(1) : '-' + state.display;
      return { ...state, display: toggled };
    }
    case 'PERCENTAGE': {
      const val = parseFloat(state.display);
      if (isNaN(val)) return state;
      return { ...state, display: formatResult(val / 100) };
    }
    case 'BACKSPACE': {
      if (state.hasResult || state.display === 'Error') return initialState;
      if (state.display.length === 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
        return { ...state, display: '0' };
      }
      return { ...state, display: state.display.slice(0, -1) };
    }
    default: return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleButton = useCallback((action: string) => {
    switch (action) {
      case 'clear': dispatch({ type: 'CLEAR' }); break;
      case 'toggle_sign': dispatch({ type: 'TOGGLE_SIGN' }); break;
      case 'percentage': dispatch({ type: 'PERCENTAGE' }); break;
      case 'backspace': dispatch({ type: 'BACKSPACE' }); break;
      case 'equals': dispatch({ type: 'CALCULATE' }); break;
      case 'decimal': dispatch({ type: 'INPUT_DECIMAL' }); break;
      case '+': case '-': case '×': case '÷':
        dispatch({ type: 'INPUT_OPERATOR', operator: action as Operator });
        break;
      default:
        if (/^\d$/.test(action)) dispatch({ type: 'INPUT_DIGIT', digit: action });
    }
  }, []);

  return { state, handleButton };
}