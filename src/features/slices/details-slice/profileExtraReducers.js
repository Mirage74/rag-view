import fetchUserProfile from "../../fetch-async/fetchUserProfile";
import { UNKNOWN_ERROR } from "../../constants";

export const buildProfileExtraReducers = (builder) => {
  builder.addCase(fetchUserProfile.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    const p = action.payload?.payload;

    if (p?.id) state.userId = p.id;
    if (p?.username) state.userName = p.username;
    if (p?.email) state.userEmail = p.email;
    if (p?.loadedFiles) state.loadedFiles = p.loadedFiles;
    if (p?.maxLoadedFiles != null) state.maxFilesToLoad = p.maxLoadedFiles;
  });

  builder.addCase(fetchUserProfile.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload ?? { status: 500, message: UNKNOWN_ERROR };
  });
};
