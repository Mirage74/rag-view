import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./features/slices/details-slice";
import uploadFilesReducer from "./features/slices/upload-slice";
import ragSliceReducer from "./features/slices/rag-slice";
import chatSliceReducer from "./features/slices/chat-slice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    uploadFiles: uploadFilesReducer,
    ragConfig: ragSliceReducer,
    chats: chatSliceReducer,
  },
});

export default store;
