import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "./constants";
import {
  METHOD_POST_QUERY,
  PREFIX_DOCUMENT,
  FORM_DATA_FILES,
  PREFIX_UPLOAD,
  ERROR_RESPONSE_NOT_OK,
  ERROR_NO_RESPONSE} from "./constants";

const initialState = {
  uploading: false,
  error: null,
  success: false,
  uploadedFiles: []
};


export const uploadFiles = createAsyncThunk(
  "uploadFiles/uploadFiles",
  async (files, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();
      const filesArray = Array.from(files);

      filesArray.forEach((file) => {
        formData.append(FORM_DATA_FILES, file);
      });

      const state = getState();
      const token = state.userDetails.token;

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("headers:", headers);

      const res = await fetch(BASE_URL + PREFIX_DOCUMENT + PREFIX_UPLOAD, {
        method: METHOD_POST_QUERY,
        headers,
        body: formData
      });

      
      if (!res.ok) {
        return rejectWithValue({
          status: res.status,
          message: ERROR_RESPONSE_NOT_OK
        });
      }

      const data = await res.json();
      return { data, fileNames: filesArray.map((f) => f.name) };
    } catch (err) {
      return rejectWithValue({
        status: 500,
        message: `${ERROR_NO_RESPONSE}: ${err}`
      });
    }
  }
);

const uploadFilesSlice = createSlice({
  name: "uploadFiles",
  initialState,
  reducers: {
    resetUploadState(state) {
      state.uploading = false;
      state.error = null;
      state.success = false;
      state.uploadedFiles = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFiles.pending, (state) => {
      state.uploading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(uploadFiles.fulfilled, (state, action) => {
      state.uploading = false;
      state.error = null;
      state.success = action.payload.data?.success ?? true;
      state.uploadedFiles = action.payload.fileNames;
    });
    builder.addCase(uploadFiles.rejected, (state, action) => {
      state.uploading = false;
      state.success = false;
      state.error = action.payload?.status ?? 500;
    });
  }
});

export const { resetUploadState } = uploadFilesSlice.actions;
export default uploadFilesSlice.reducer;
