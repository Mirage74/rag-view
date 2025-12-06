import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_URL,
  METHOD_GET_QUERY,
  PREFIX_AUTH,
  PREFIX_REFRESH_TOKEN,
  TOKEN_UNDEFINED,
  JWT_REFRESH_TOKEN,
  ERROR_RESPONSE_NOT_OK,
  ERROR_NO_RESPONSE,
  NO_REFRESH_TOKEN,
} from "../constants";

const fetchRefreshToken = createAsyncThunk(
  "userDetails/fetchRefreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken =
        state.userDetails?.refreshToken ||
        localStorage.getItem(JWT_REFRESH_TOKEN);

      if (!refreshToken || refreshToken === TOKEN_UNDEFINED) {
        return rejectWithValue({ status: 401, message: NO_REFRESH_TOKEN });
      }

      const url =
        BASE_URL +
        PREFIX_AUTH +
        PREFIX_REFRESH_TOKEN +
        `?token=${encodeURIComponent(refreshToken)}`;

      const res = await fetch(url, { method: METHOD_GET_QUERY });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return rejectWithValue({
          status: res.status,
          message: text || ERROR_RESPONSE_NOT_OK,
        });
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue({
        status: 500,
        message: `${ERROR_NO_RESPONSE}: ${err}`,
      });
    }
  }
);

export default fetchRefreshToken;
