import axios, { AxiosResponse } from 'axios';
import { Currency } from '@/types/index';

export const fetchCurrencies = async (): Promise<Currency[] | []> => {
  try {
    const { data }: AxiosResponse<Currency[]> = await axios.get<Currency[]>('/api/currencies');

    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error
  }
};