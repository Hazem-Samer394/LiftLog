import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './page/HomePage'
import ProgramDetail from './page/ProgramDetail'
import Workout from './page/Workout'
import History from './page/History'
import Profile from './page/Profile'
import NavigationBar from './components/NavigationBar'
import Exercise from './page/Exercise'
import Onboarding from './page/Onboarding'

export default function App() {
  return (
    <div className='mt-4 w-full md:w-[50%] mx-auto p-4 md:p-10 pb-24'>
        <Navbar />
<Routes>
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/" element={<HomePage />} />
  <Route path="/programs/:id" element={<ProgramDetail />} />
<Route path="/workout/:program/:day" element={<Workout />} />
  <Route path="/history" element={<History />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/exercise/:id/:dayName" element={<Exercise />} />
</Routes>
  <NavigationBar />
    </div>
  )
}
