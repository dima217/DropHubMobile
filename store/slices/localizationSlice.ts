import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const SUPPORTED_LANGUAGES = ["ru", "be", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

interface LocalizationState {
  language: AppLanguage;
}

const initialState: LocalizationState = {
  language: "ru",
};

const localizationSlice = createSlice({
  name: "localization",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = localizationSlice.actions;
export default localizationSlice.reducer;
