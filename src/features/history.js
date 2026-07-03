import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const savedWorkouts = localStorage.getItem('workouts');
const initialState = {
    workouts: savedWorkouts ? JSON.parse(savedWorkouts) : []
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
     addWorkout: (state, action) => {
      state.workouts.unshift(action.payload);
      // Save to localStorage
      localStorage.setItem('workouts', JSON.stringify(state.workouts));
    },
    }
});

export const { addWorkout } = historySlice.actions;
export default historySlice.reducer;