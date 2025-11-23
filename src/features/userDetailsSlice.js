import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const USER_NAME_UNDEFINED = "userNameUndefined";
export const USER_EMAIL_UNDEFINED = "userEmailUndefined";
const ERROR_RESPONSE_NOT_OK = "Response not ok";
const ERROR_NO_RESPONSE = "No response from server";
const BASE_URL = "http://localhost:8080";
const PREFIX_REGISTER  = "/auth/register";
const METHOD_POST_QUERY = "POST";
const APPLICATION_JSON = "application/json";
const HEADER_CONTENT_TYPE = "Content-Type";
const JWT_TOKEN = "jwt";
const JWT_REFRESH_TOKEN = "jwt-refresh";

const initialState = {
  userName: USER_NAME_UNDEFINED,
  userEmail: USER_EMAIL_UNDEFINED,
  loading: false,
  error: null
};

export const fetchRegisterUser = createAsyncThunk(
  "userDetails/fetchRegisterUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + PREFIX_REGISTER, {
        method: METHOD_POST_QUERY,
        headers: { [HEADER_CONTENT_TYPE]: APPLICATION_JSON },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return rejectWithValue({
          status: res.status,
          message: ERROR_RESPONSE_NOT_OK,
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

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    logoutUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRegisterUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRegisterUser.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.userName = action.payload.payload.username;
      state.userEmail = action.payload.payload.email;
      localStorage.setItem(JWT_TOKEN, action.payload.payload.token);
      localStorage.setItem(JWT_REFRESH_TOKEN, action.payload.payload.refreshToken);
    });
    builder.addCase(fetchRegisterUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.status ?? 500;
    });
  },
});

export const { logoutUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;