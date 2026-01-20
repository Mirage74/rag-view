import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import {
  BASE_URL,
  PREFIX_CHAT,
  METHOD_GET_QUERY,
  STATUS_UNAUTHORIZED,
  UNKNOWN_ERROR,
  HTTP_STATUS_UNAUTHORIZED_CODE,
} from "../constants";

const fetchGetChatList = createAsyncThunk(
  "chat/fetchGetChatList",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await fetchWithAuth(
        `${BASE_URL}${PREFIX_CHAT}`,
        { method: METHOD_GET_QUERY },
        thunkAPI,
      );

      if (res.status === HTTP_STATUS_UNAUTHORIZED_CODE) {
        return rejectWithValue({ status: STATUS_UNAUTHORIZED });
      }

      if (!res.ok) {
        return rejectWithValue({ status: UNKNOWN_ERROR });
      }

      const data = await res.json();
      return data;
    } catch {
      return rejectWithValue({ status: UNKNOWN_ERROR });
    }
  },
);

export default fetchGetChatList;
