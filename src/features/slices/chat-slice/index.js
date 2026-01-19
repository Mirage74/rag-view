import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./initialState";
//import { reducers } from "./reducers";
import { buildNewChatExtraReducers } from "./newChatExtraReducers";

const chatSlice = createSlice({
  name: "chats",
  initialState,
  extraReducers: (builder) => {
    buildNewChatExtraReducers(builder);
  },
});

export default chatSlice.reducer;
