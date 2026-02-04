import fetchDeleteChat from "../../fetch-async/fetchDeleteChat";

export const buildDeleteChatExtraReducers = (builder) => {
  builder
    .addCase(fetchDeleteChat.fulfilled, (state, action) => {
      const deletedChatId = action.meta.arg;

      state.chatList = state.chatList.filter((chat) => chat.id !== deletedChatId);

      if (state.activeChatId === deletedChatId) {
        if (state.chatList.length > 0) {
          state.activeChatId = state.chatList[0].id;
          state.activeTitle = state.chatList[0].title;
        } else {
          state.activeChatId = null;
          state.activeTitle = "";
          state.messages = [];
        }
      }
    })
    .addCase(fetchDeleteChat.rejected, (_state, action) => {
      console.log("fetchDeleteChat error:", action.payload?.status);
    });
};
