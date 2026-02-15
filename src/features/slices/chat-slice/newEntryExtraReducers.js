import fetchAddNewUserEntry from "../../fetch-async/fetchAddNewUserEntry";
import { MESSAGE_ROLE } from "../../constants";

export const buildNewEntryExtraReducers = (builder) => {
  builder
    .addCase(fetchAddNewUserEntry.pending, (state, action) => {
      const { content } = action.meta.arg;
      state.messages.push({ role: MESSAGE_ROLE.USER, content });
      state.isWaitingResponse = true;
    })
    .addCase(fetchAddNewUserEntry.fulfilled, (state) => {
      state.isWaitingResponse = false;
    })
    .addCase(fetchAddNewUserEntry.rejected, (state, action) => {
      state.isWaitingResponse = false;
      console.log("fetchAddNewUserEntry error:", action.payload?.status);
    });
};
