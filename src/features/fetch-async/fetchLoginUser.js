import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BASE_URL,
  METHOD_POST_QUERY,
  HEADER_CONTENT_TYPE,
  PREFIX_AUTH,
  PREFIX_LOGIN,
  APPLICATION_JSON,
  ERROR_RESPONSE_NOT_OK,
  ERROR_NO_RESPONSE,
} from "../constants";

const fetchLoginUser = createAsyncThunk(
  "userDetails/fetchLoginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + PREFIX_AUTH + PREFIX_LOGIN, {
        method: METHOD_POST_QUERY,
        headers: { [HEADER_CONTENT_TYPE]: APPLICATION_JSON },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Проверяем Content-Type ответа
        const contentType = res.headers.get("Content-Type") || "";
        let errorMessage = ERROR_RESPONSE_NOT_OK;

        if (contentType.includes("application/json")) {
          const errorData = await res.json().catch(() => ({}));
          errorMessage = errorData.message || ERROR_RESPONSE_NOT_OK;
        } else {
          // text/plain ответ
          const textError = await res.text().catch(() => "");
          errorMessage = textError || ERROR_RESPONSE_NOT_OK;
        }

        return rejectWithValue({
          status: res.status,
          message: errorMessage,
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

export default fetchLoginUser;
