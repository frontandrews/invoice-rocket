import { createSelector } from '@reduxjs/toolkit'
import { Client } from "@/types"

export const selectClientById = createSelector(
  state => state.clients,
  (_, clientId) => clientId,
  (clients: Client[], clientId) => clients.find(client => client.id === clientId) || null
);