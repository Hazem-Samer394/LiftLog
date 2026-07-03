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
        <div className='bg-[#141414] p-4 md:p-6 rounded-2xl gap-1 flex flex-col'>
<p className='text-[#6B7280] text-sm md:text-base'>Ready to train?</p>
<h1 className='text-white text-xl md:text-2xl font-bold'>Today's Workout</h1>
<span className='text-[#6B7280] text-sm md:text-base'>{currentProgramName}</span>
        </div>


        <div className='mt-5'>
            <button
              onClick={handleQuickStart}
              className='bg-[#22C55E] text-black font-lg px-4 py-3 md:py-2 w-full cursor-pointer rounded-2xl text-base md:text-lg'
            >
              Quick Start Workout
            </button>
        </div>


        <div className='mt-4'>
            <span className='text-[#6B7280] text-lg md:text-xl'>Recent Workouts</span>


         <div className='flex flex-col gap-2 mt-5'>
            {workouts.slice(0, 3).map((workout) => (
               <div key={workout.id} className='flex bg-[#1A1A1A] px-3 py-3 p-2 gap-2 rounded-xl justify-between items-center'>
                <div className=' flex gap-2 '>
                    <h1 className=' font-semibold text-white text-sm md:text-base'>Workout</h1>
                    <span className='text-[#6B7280] font-semibold text-sm md:text-base'>{workout.program}</span>

                </div>

                <div className='text-[#6B7280] text-xs md:text-sm'>{workout.date}</div>
            </div>
            ))}
            {workouts.length === 0 && (
                <p className='text-[#6B7280] text-center text-sm md:text-base'>No recent workouts</p>
            )}
         </div>

        </div>
    </div>
  )
}
