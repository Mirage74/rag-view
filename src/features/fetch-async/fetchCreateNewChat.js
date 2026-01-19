import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "./fetchWithAuth";
import {
  BASE_URL,
  PREFIX_CHAT,
  PREFIX_CREATE_NEW_CHAT,
  METHOD_POST_QUERY,
} from "../constants";

const fetchCreateNewChat = createAsyncThunk(
  "chat/fetchCreateNewChat",
  async (title, thunkAPI) => {
    const res = await fetchWithAuth(
      `${BASE_URL}${PREFIX_CHAT}${PREFIX_CREATE_NEW_CHAT}?title=${encodeURIComponent(
        title
      )}`,
      { method: METHOD_POST_QUERY },
      thunkAPI
    );

    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.log("Creating new chat failed");
      return;
    }

    const data = JSON.parse(text);
    return data;
  }
);

export default fetchCreateNewChat;
