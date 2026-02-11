import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TagColorMap {
  [tagName: string]: string;
}

interface TagColorsState {
  colors: TagColorMap;
}

const initialState: TagColorsState = {
  colors: {},
};

const tagColorsSlice = createSlice({
  name: "tagColors",
  initialState,
  reducers: {
    setTagColor(state, action: PayloadAction<{ tag: string; color: string }>) {
      state.colors[action.payload.tag] = action.payload.color;
    },
    removeTagColor(state, action: PayloadAction<string>) {
      delete state.colors[action.payload];
    },
    setAllTagColors(state, action: PayloadAction<TagColorMap>) {
      state.colors = action.payload;
    },
  },
});

export const { setTagColor, removeTagColor, setAllTagColors } =
  tagColorsSlice.actions;
export default tagColorsSlice.reducer;

