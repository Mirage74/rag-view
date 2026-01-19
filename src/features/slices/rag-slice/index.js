import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { reducers } from "./reducers";

const ragSlice = createSlice({
  name: "ragConfig",
  initialState,
  reducers,
});

export const { switchSearchMode, setTopK, setTopP } = ragSlice.actions;

export default ragSlice.reducer;
