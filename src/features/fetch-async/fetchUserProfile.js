import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import { logoutUser } from "../slices/details-slice";
import {
  BASE_URL,
  PREFIX_USERS,
  PREFIX_USERINFO,
  METHOD_GET_QUERY,
} from "../constants";

const fetchUserProfile = createAsyncThunk(
  "userDetails/fetchUserProfile",
  async (_, thunkAPI) => {
    const res = await fetchWithAuth(
      BASE_URL + PREFIX_USERS + PREFIX_USERINFO,
      { method: METHOD_GET_QUERY },
      thunkAPI
    );

    const text = await res.text().catch(() => "");
    if (!res.ok) {
      //if (text === TOKEN_EXPIRED) {
      thunkAPI.dispatch(logoutUser());
      return;
      //}
      //return thunkAPI.rejectWithValue({
      //        status: res.status,
      //      message: text || ERROR_RESPONSE_NOT_OK,
      //  });
    }

    const data = JSON.parse(text);
    return data;
  }
);

export default fetchUserProfile;
