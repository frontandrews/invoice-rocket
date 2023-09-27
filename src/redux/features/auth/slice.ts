// This third-party is used only to handle the login or logout process for example purposes
// We are not using the data from data service in the app, as it will be probably replaced by a backend service.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, Auth } from "firebase/auth";
import { isBrowser } from '@/utils/helper';

interface LogInParams {
    auth: Auth;
    email: string;
    password: string;
}

const loadState = () => {
    try {
      const serializedState = isBrowser() && localStorage.getItem('auth');
      if (!serializedState) return initialState;
      return JSON.parse(serializedState)
    } catch (e) {
      console.error("Could not load state", e);
      return initialState;
    }
  };
  
export const initialState = {
    user: {
        isAuthenticated: false,
        id: '',
        name: '',
        surname: '',
        email: '',
        token: '',
        refreshToken: ''
    }
};

export const logInAsync = createAsyncThunk(
    'auth/logIn',
    async ({ auth, email, password }: LogInParams) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return {
          id: user.uid,
          email: user.email,
          name: user.displayName,
        };
      } catch (error) {
        console.error('Error signing in: ', error);
        throw error;
      }
    }
);
  
export const auth = createSlice({
    name: 'auth',
    initialState: loadState(),
    reducers: {
        logOut() {
            localStorage.removeItem('auth');
            return initialState;
        },
        
    },
    extraReducers: (builder) => {
        builder.addCase(logInAsync.fulfilled, (state, action) => {
            const newState = {
                ...state,
                user: {
                    ...state.user,
                    isAuthenticated: true,
                },
            };
                
            localStorage.setItem('auth', JSON.stringify(newState));
            
            return newState;

        });
    }
});

export const { logOut } = auth.actions;
export default auth.reducer