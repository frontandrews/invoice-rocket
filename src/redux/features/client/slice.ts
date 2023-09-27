import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from "@/types";
import { isBrowser } from '@/utils/helper';

// Load Clients from Local Storage
const loadClients = () => {
  try {
    const serializedState = isBrowser() && localStorage.getItem('clients');
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load clients", e);
    return [];
  }
};

const initialState = loadClients();

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state: Client[], action: PayloadAction<Client>) => {
      state.push(action.payload);
      localStorage.setItem('clients', JSON.stringify(state));
    },
    updateClient: (state: Client[], action: PayloadAction<Client>) => {
      const index = state.findIndex(client => client.id === action.payload.id);
      state[index] = action.payload;
      localStorage.setItem('clients', JSON.stringify(state));
    },
    removeClient: (state: Client[], action: PayloadAction<string>) => {
      const index = state.findIndex(client => client.id === action.payload);
      state.splice(index, 1);
      localStorage.setItem('clients', JSON.stringify(state));
    }
  }
});

export const { addClient, updateClient, removeClient } = clientsSlice.actions;
export default clientsSlice.reducer;
