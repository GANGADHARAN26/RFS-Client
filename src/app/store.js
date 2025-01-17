import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice"; // Assuming you already have authSlice
import candidateReducer from "../Redux/candidates/candidateSlice"; // Import the candidateSlice
// 
const store = configureStore({
  reducer: {
    // auth: authReducer, // Reducer for authentication
    candidates: candidateReducer, // Reducer for candidate management
  },
});

export default store;