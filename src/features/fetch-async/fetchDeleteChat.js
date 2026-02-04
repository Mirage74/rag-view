import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import {
  BASE_URL,
  PREFIX_CHAT,
  METHOD_DELETE_QUERY,
  STATUS_UNAUTHORIZED,
  UNKNOWN_ERROR,
  HTTP_STATUS_UNAUTHORIZED_CODE,
} from "../constants";

const fetchDeleteChat = createAsyncThunk(
  "chat/fetchDeleteChat",
  async (chatId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await fetchWithAuth(
        `${BASE_URL}${PREFIX_CHAT}/${chatId}`,
        { method: METHOD_DELETE_QUERY },
        thunkAPI,
      );

      if (res.status === HTTP_STATUS_UNAUTHORIZED_CODE) {
        return rejectWithValue({ status: STATUS_UNAUTHORIZED });
      }

      if (!res.ok) {
        return rejectWithValue({ status: UNKNOWN_ERROR });
      }

      // DELETE requests may return 204 No Content without a body
      if (res.status === 204) {
        return { success: true, chatId };
      }

      try {
        const data = await res.json();
        return data;
      } catch {
        // If JSON parsing fails, still consider it a success
        return { success: true, chatId };
      }
    } catch {
      return rejectWithValue({ status: UNKNOWN_ERROR });
    }
  },
);

export default fetchDeleteChat;
