import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'shop_book_data_v1';

export const loadData = async (): Promise<AppData> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      sales: [],
      expenses: [],
      stock: [],
      debts: [],
      settings: DEFAULT_SETTINGS,
    };
  }
  return JSON.parse(raw);
};

export const saveData = async (data: AppData): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = async (): Promise<string> => {
  const data = await loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = async (json: string): Promise<void> => {
  const parsed = JSON.parse(json);
  await saveData(parsed);
};

export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};