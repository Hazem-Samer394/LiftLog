import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { programs } from '../data/programs'
import Navbar from '../components/Navbar'

export default function HomePage() {
  const navigate = useNavigate()
  const onboardingCompleted = useSelector((state) => state.program.onboardingCompleted)
  const selectedProgram = useSelector((state) => state.program.selectedProgram)
  const workouts = useSelector((state) => state.history.workouts)

  useEffect(() => {
    if (!onboardingCompleted) {
      navigate('/onboarding')
    }
  }, [onboardingCompleted, navigate])

  const handleQuickStart = () => {
    if (selectedProgram) {
      const programData = programs[selectedProgram]
      const firstDay = Object.keys(programData.days)[0]
      navigate(`/workout/${selectedProgram}/${firstDay}`)
    }
  }

  if (!onboardingCompleted) {
    return null
  }

  const currentProgramName = selectedProgram ? programs[selectedProgram]?.name : 'No program selected'

  return (
    <div className='mt-6 rounded-2xl'>
        <div className='bg-[#141414] p-6 rounded-2xl gap-1 flex flex-col'>
<p className='text-[#6B7280]'>Ready to train?</p>
<h1 className='text-white text-2xl font-bold'>Today's Workout</h1>
<span className='text-[#6B7280]'>{currentProgramName}</span>
        </div>


        <div className='mt-5'>
            <button 
              onClick={handleQuickStart}
              className='bg-[#22C55E] text-black font-lg px-4 py-2 w-full cursor-pointer  rounded-2xl'
            >
              Quick Start Workout
            </button>
        </div>


        <div className='mt-4'>
            <span className='text-[#6B7280] text-xl'>Recent Workouts</span>


         <div className='flex flex-col gap-1 mt-5'>
            {workouts.slice(0, 3).map((workout) => (
               <div key={workout.id} className='flex bg-[#1A1A1A] px-3 py-3 p-2 gap-2 rounded-xl justify-between'> 
                <div className=' flex gap-2 '>
                    <h1 className=' font-semibold text-white'>Workout</h1>
                    <span className='text-[#6B7280] font-semibold'>{workout.program}</span>
                    
                </div>
            
                <div className='text-[#6B7280]'>{workout.date}</div>
            </div>
            ))}
            {workouts.length === 0 && (
                <p className='text-[#6B7280] text-center'>No recent workouts</p>
            )}
         </div>
            
        </div>
    </div>
  )
}
