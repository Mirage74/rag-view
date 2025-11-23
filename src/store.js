import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./features/userDetailsSlice";

const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer
  },
});

export default store;
