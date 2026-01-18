import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./initialState";
import { reducers } from "./reducers";
import { buildAuthExtraReducers } from "./authExtraReducers";
import { buildProfileExtraReducers } from "./profileExtraReducers";
import { buildDeleteExtraReducers } from "./deleteExtraReducers";

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers,
  extraReducers: (builder) => {
    buildAuthExtraReducers(builder);
    buildProfileExtraReducers(builder);
    buildDeleteExtraReducers(builder);
  },
});

//export const { logoutUser, clearError, clearDeleteStatus, addLoadedFiles } =
export const { logoutUser, clearError, clearDeleteStatus } =
  userDetailsSlice.actions;

export default userDetailsSlice.reducer;
