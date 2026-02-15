import fetchGetChat from "../../fetch-async/fetchGetChat";

export const buildGetChatExtraReducers = (builder) => {
  builder
    .addCase(fetchGetChat.fulfilled, (state, action) => {
      const chat = action.payload;

      if (chat) {
        state.messages = chat.history || [];
      }
    })
    .addCase(fetchGetChat.rejected, (_state, action) => {
      console.log("fetchGetChat error:", action.payload?.status);
    });
};
