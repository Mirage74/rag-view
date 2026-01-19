import fetchCreateNewChat from "../../fetch-async/fetchCreateNewChat";

export const buildNewChatExtraReducers = (builder) => {
  builder.addCase(fetchCreateNewChat.fulfilled, (state, action) => {
    const chat = action.payload;
    //console.log("action.payload:", action.payload);

    if (chat) {
      state.chatList.push(chat);
      state.activeChatId = chat.id;
      state.activeTitle = chat.title;
      state.messages = [];
    }
  });
};
