import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from "@/types"
import { isBrowser } from '@/utils/helper';

const loadProfileData = () => {
  try {
    const serializedState = isBrowser() && localStorage.getItem('profile');
    if (!serializedState) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load profile data", e);
    return {};
  }
};

const initialState = loadProfileData();

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    addProfileData: (state: Profile, action: PayloadAction<Profile>) => {
      localStorage.setItem('profile', JSON.stringify({ ...state, ...action.payload }));
      return { ...state, ...action.payload };
    },
  }
});

export const { addProfileData } = profileSlice.actions;
export default profileSlice.reducer;
