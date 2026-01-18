import {
  USER_NAME_UNDEFINED,
  USER_EMAIL_UNDEFINED,
  JWT_TOKEN,
  JWT_REFRESH_TOKEN,
} from "../../constants";

import { initialState } from "./initialState";

export const reducers = {
  logoutUser(state) {
    Object.assign(state, initialState);
    state.token = null;
    state.refreshToken = null;
    localStorage.removeItem(JWT_TOKEN);
    localStorage.removeItem(JWT_REFRESH_TOKEN);
  },

  clearError(state) {
    state.error = null;
  },

  clearDeleteStatus(state) {
    state.deleteSuccess = false;
    state.deletedCount = 0;
  },

  // addLoadedFiles(state, action) {
  //   state.loadedFiles = [...state.loadedFiles, ...action.payload];
  // },
};
