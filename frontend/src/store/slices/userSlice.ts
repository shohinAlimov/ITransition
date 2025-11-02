import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  isAuth: boolean;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
