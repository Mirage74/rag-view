import fetchDeleteUploaded from "../../fetch-async/fetchDeleteUploaded";
import { UNKNOWN_ERROR } from "../../constants";

export const buildDeleteExtraReducers = (builder) => {
  builder.addCase(fetchDeleteUploaded.pending, (state) => {
    state.deleting = true;
    state.deleteSuccess = false;
    state.deletedCount = 0;
    state.error = null;
  });

  builder.addCase(fetchDeleteUploaded.fulfilled, (state, action) => {
    state.deleting = false;
    state.deleteSuccess = true;
    state.deletedCount = action.payload?.payload ?? 0;
    state.loadedFiles = [];
    state.error = null;
  });

  builder.addCase(fetchDeleteUploaded.rejected, (state, action) => {
    state.deleting = false;
    state.deleteSuccess = false;
    state.error = action.payload ?? { status: 500, message: UNKNOWN_ERROR };
  });
};
