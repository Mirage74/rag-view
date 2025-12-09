import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import {
  BASE_URL,
  PREFIX_USERS,
  PREFIX_USERINFO,
  METHOD_DELETE_QUERY,
  ERROR_RESPONSE_NOT_OK,
} from "../constants";

const fetchDeleteUploaded = createAsyncThunk(
  "userDetails/fetchDeleteUploaded",
  async (_, thunkAPI) => {
    const res = await fetchWithAuth(
      BASE_URL + PREFIX_USERS + PREFIX_USERINFO,
      { method: METHOD_DELETE_QUERY },
      thunkAPI
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return thunkAPI.rejectWithValue({
        status: res.status,
        message: text || ERROR_RESPONSE_NOT_OK,
      });
    }

    const data = await res.json();
    return data;
  }
);

export default fetchDeleteUploaded;
