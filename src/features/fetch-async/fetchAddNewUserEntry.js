import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import {
  BASE_URL,
  PREFIX_ENTRY,
  METHOD_POST_QUERY,
  STATUS_UNAUTHORIZED,
  UNKNOWN_ERROR,
  HTTP_STATUS_UNAUTHORIZED_CODE,
} from "../constants";

const fetchAddNewUserEntry = createAsyncThunk(
  "chat/fetchAddNewUserEntry",
  async ({ chatId, content }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await fetchWithAuth(
        `${BASE_URL}${PREFIX_ENTRY}/${chatId}?content=${encodeURIComponent(
          content,
        )}`,
        { method: METHOD_POST_QUERY },
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

export default fetchAddNewUserEntry;
