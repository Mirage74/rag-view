import { createSlice } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

import { initialState } from "./initialState";
import { buildNewChatExtraReducers } from "./newChatExtraReducers";
import { buildChatListExtraReducers } from "./getChatListExtraReducers";

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers,
  extraReducers: (builder) => {
    buildNewChatExtraReducers(builder);
    buildChatListExtraReducers(builder);
  },
});

// Export the action
export const { setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
