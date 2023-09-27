import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from "@/types"
import { isBrowser } from '@/utils/helper';

// Load Invoices from Local Storage
const loadInvoices = () => {
  try {
    const serializedState = isBrowser() && localStorage.getItem('invoices');
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load invoices", e);
    return [];
  }
};

const initialState = loadInvoices();

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state: Invoice[], action: PayloadAction<Invoice>) => {
      state.push(action.payload);
      localStorage.setItem('invoices', JSON.stringify(state));
    },
    updateInvoice: (state: Invoice[], action: PayloadAction<Invoice>) => {
      const index = state.findIndex(invoice => invoice.id === action.payload.id);
      if(index !== -1) state[index] = action.payload;
      localStorage.setItem('invoices', JSON.stringify(state));
    },
    removeInvoice: (state: Invoice[], action: PayloadAction<string>) => {
      const index = state.findIndex(invoice => invoice.id === action.payload);
      if(index !== -1) state.splice(index, 1);
      localStorage.setItem('invoices', JSON.stringify(state));
    }
  }
});

export const { addInvoice, updateInvoice, removeInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
