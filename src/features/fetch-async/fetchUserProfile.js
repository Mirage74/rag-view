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
    try {
      const res = await fetchWithAuth(
        BASE_URL + PREFIX_USERS + PREFIX_USERINFO,
        { method: METHOD_GET_QUERY },
        thunkAPI,
      );

      const text = await res.text().catch(() => "");
      if (!res.ok) {
        thunkAPI.dispatch(logoutUser());
        return;
      }

      const data = JSON.parse(text);
      return data;
    } catch {
      thunkAPI.dispatch(logoutUser());
    }
  },
);

export default fetchUserProfile;
