import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** Flips to true once localStorage has been read on the client, so UI can avoid a flash of "logged out". */
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
    hydrateFromStorage: (
      state,
      action: PayloadAction<{ token: string | null }>,
    ) => {
      state.token = action.payload.token;
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, hydrateFromStorage } =
  authSlice.actions;
export default authSlice.reducer;
