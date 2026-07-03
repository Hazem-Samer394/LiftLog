import { configureStore } from "@reduxjs/toolkit";
import programReducer from "../features/program/programSlice";
import historyReducer from "../features/history";

const store = configureStore({
  reducer: {
    program: programReducer,  
    history: historyReducer,
  },
});

export default store;