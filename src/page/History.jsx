import React from 'react'
import { useSelector } from 'react-redux'
import { programs } from '../data/programs'

export default function History() {
    const workouts = useSelector((state) => state.history.workouts);

  return (
    <div>
              <div className='sticky top-0 bg-[#0a0a0a] py-4 z-10'>
            <h1 className='text-white text-2xl font-bold'>Workout History</h1>
        </div>
        
        <div className='flex flex-col gap-4 mt-4'>
            {workouts.length === 0 ? (
                <p className='text-[#6B7280] text-center'>No workouts saved yet</p>
            ) : (
                workouts.map((workout) => {
                    const programName = programs[workout.program]?.name || workout.program;
                    return (
                        <div key={workout.id} className='p-3 flex flex-col bg-[#1A1A1A] rounded-xl gap-2'>
                            <div className='flex justify-between'> 
                                <h1 className='text-[#00C950] text-xl font-bold'>{workout.title}</h1>
                                <div className='text-[#6B7280]'>{workout.date}</div>
                            </div>

                            <div className='text-[#6B7280] text-sm'>
                                {programName} · {workout.duration}
                            </div>

                            <div className='mt-2'>
                                <p className='text-[#6B7280] text-sm font-semibold mb-2'>Exercises:</p>
                                {workout.exercises.map((exercise, index) => (
                                    <div key={index} className='text-[#6B7280] text-sm ml-2'>
                                        • {exercise.name}
                                        {exercise.weight > 0 && <span> - {exercise.weight}kg</span>}
                                        {exercise.sets > 0 && <span> - {exercise.sets} sets</span>}
                                        {exercise.reps > 0 && <span> - {exercise.reps} reps</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  )
}
