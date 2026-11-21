export interface Sale {
  id: string;
  product: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
}

export interface Debt {
  id: string;
  customer: string;
  amount: number;
  amountPaid: number;
  date: string;
  dueDate?: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  costPrice: number;
  sellingPrice: number;
}

export interface Settings {
  pin: string | null;
  currency: string;
}

export interface AppData {
  sales: Sale[];
  expenses: Expense[];
  debts: Debt[];
  stock: StockItem[];
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  pin: null,
  currency: 'GHS',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: '\u20B5',
  USD: '$',
  EUR: '\u20AC',
  GBP: '\u00A3',
};