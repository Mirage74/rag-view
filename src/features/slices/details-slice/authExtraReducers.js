import fetchLoginUser from "../../fetch-async/fetchLoginUser";
import fetchRegisterUser from "../../fetch-async/fetchRegisterUser";
import fetchRefreshToken from "../../fetch-async/fetchRefreshToken";
import { updateTokens } from "./tokenHelpers";
import { UNKNOWN_ERROR } from "../../constants";

export const buildAuthExtraReducers = (builder) => {
  // Register
  builder.addCase(fetchRegisterUser.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchRegisterUser.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    const p = action.payload.payload;
    state.userName = p.username;
    state.userEmail = p.email;
    updateTokens(state, p.token, p.refreshToken);
  });

  builder.addCase(fetchRegisterUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.status ?? 500;
  });

  // Login
  builder.addCase(fetchLoginUser.pending, (state) => {
    state.loading = true;
    state.error = null;
  });

  builder.addCase(fetchLoginUser.fulfilled, (state, action) => {
    state.loading = false;
    state.error = null;

    const p = action.payload.payload;
    state.userName = p.username;
    state.userEmail = p.email;
    updateTokens(state, p.token, p.refreshToken);
  });

  builder.addCase(fetchLoginUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload ?? { status: 500, message: UNKNOWN_ERROR };
  });

  // Refresh Token
  builder.addCase(fetchRefreshToken.fulfilled, (state, action) => {
    const p = action.payload?.payload;
    updateTokens(state, p?.token, p?.refreshToken);
  });

  builder.addCase(fetchRefreshToken.rejected, (state, action) => {
    state.error = action.payload ?? { status: 500, message: UNKNOWN_ERROR };
  });
};
