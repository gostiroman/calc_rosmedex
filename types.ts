export enum CalculatorMode {
  STANDARD = 'STANDARD',
  AI_MEDICAL = 'AI_MEDICAL',
  CURRENCY = 'CURRENCY'
}

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}