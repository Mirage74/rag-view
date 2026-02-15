import { createSlice } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

import { initialState } from "./initialState";
import { buildNewChatExtraReducers } from "./newChatExtraReducers";
import { buildChatListExtraReducers } from "./getChatListExtraReducers";
import { buildDeleteChatExtraReducers } from "./deleteChatExtraReducers";
import { buildNewEntryExtraReducers } from "./newEntryExtraReducers";
import { buildGetChatExtraReducers } from "./getChatExtraReducers";

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers,
  extraReducers: (builder) => {
    buildNewChatExtraReducers(builder);
    buildChatListExtraReducers(builder);
    buildDeleteChatExtraReducers(builder);
    buildNewEntryExtraReducers(builder);
    buildGetChatExtraReducers(builder);
  },
});

export const { setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
