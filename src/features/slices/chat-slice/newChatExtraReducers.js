import fetchCreateNewChat from "../../fetch-async/fetchCreateNewChat";

export const buildNewChatExtraReducers = (builder) => {
  builder
    .addCase(fetchCreateNewChat.fulfilled, (state, action) => {
      const chat = action.payload;

      if (chat) {
        state.chatList.push(chat);
        state.activeChatId = chat.id;
        state.activeTitle = chat.title;
        state.messages = [];
      }
    })
    .addCase(fetchCreateNewChat.rejected, (state, action) => {
      console.log("fetchCreateNewChat error:", action.payload?.status);
    });
};
