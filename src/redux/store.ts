import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/slice";
import clientsReducer from "./features/client/slice";
import profileReducer from "./features/profile/slice";
import invoiceReducer from "./features/invoice/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    invoices: invoiceReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
