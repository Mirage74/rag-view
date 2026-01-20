import fetchGetChatList from "../../fetch-async/fetchGetChatList";

export const buildChatListExtraReducers = (builder) => {
  builder
    .addCase(fetchGetChatList.fulfilled, (state, action) => {
      const chatList = action.payload;

      if (chatList && chatList.length > 0) {
        state.chatList = chatList;
        state.messages = [];
      }
    })
    .addCase(fetchGetChatList.rejected, (state, action) => {
      console.log("fetchGetChatList error:", action.payload?.status);
    });
};
