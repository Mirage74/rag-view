export const reducers = {
  setActiveChat(state, action) {
    const chat = action.payload;
    state.activeChatId = chat.id;
    state.activeTitle = chat.title;
    state.messages = chat.history || [];
  },
};
