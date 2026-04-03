import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  current: "EN" | "FR";
}

const initialState: LanguageState = {
  current: "EN",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"EN" | "FR">) => {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const selectLanguage = (state: any) => state.language.current;

export default languageSlice.reducer;
