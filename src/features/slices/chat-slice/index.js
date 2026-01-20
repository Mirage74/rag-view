import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./initialState";
//import { reducers } from "./reducers";
import { buildNewChatExtraReducers } from "./newChatExtraReducers";
import { buildChatListExtraReducers } from "./getChatListExtraReducers";

const chatSlice = createSlice({
  name: "chats",
  initialState,
  extraReducers: (builder) => {
    buildNewChatExtraReducers(builder);
    buildChatListExtraReducers(builder);
  },
});

export default chatSlice.reducer;
