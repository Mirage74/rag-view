import fetchAddNewUserEntry from "../../fetch-async/fetchAddNewUserEntry";

export const buildNewEntryExtraReducers = (builder) => {
  builder
    .addCase(fetchAddNewUserEntry.fulfilled, (state, action) => {
      const entry = action.payload;

      if (entry) {
        state.messages.push(entry);
      }
    })
    .addCase(fetchAddNewUserEntry.rejected, (_state, action) => {
      console.log("fetchAddNewUserEntry error:", action.payload?.status);
    });
};
