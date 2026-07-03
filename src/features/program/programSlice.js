import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const savedOnboarding = localStorage.getItem('onboardingCompleted');
const savedProgram = localStorage.getItem('selectedProgram');

const initialState = {
  selectedProgram: savedProgram || null,
  selectedDay: null,
  onboardingCompleted: savedOnboarding === 'true',
};

const programSlice = createSlice({
  name: "program",
  initialState,

  reducers: {
    setProgram: (state, action) => {
      state.selectedProgram = action.payload;
      localStorage.setItem('selectedProgram', action.payload);
    },
    setDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
      localStorage.setItem('onboardingCompleted', 'true');
    },
    resetOnboarding: (state) => {
      state.onboardingCompleted = false;
      localStorage.setItem('onboardingCompleted', 'false');
    },
  },
});

export const { setProgram, setDay, completeOnboarding, resetOnboarding } = programSlice.actions;
export default programSlice.reducer;
