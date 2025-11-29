import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./features/userDetailsSlice";
import uploadFilesReducer from "./features/uploadFilesSlice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    uploadFiles: uploadFilesReducer
  },
});

export default store;
