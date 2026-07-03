import React from 'react'
import { useSelector } from 'react-redux'
import { programs } from '../data/programs'

export default function History() {
    const workouts = useSelector((state) => state.history.workouts);

  return (
    <div>
              <div className='sticky top-0 bg-[#0a0a0a] py-4 z-10'>
            <h1 className='text-white text-xl md:text-2xl font-bold'>Workout History</h1>
        </div>

        <div className='flex flex-col gap-4 mt-4'>
            {workouts.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>🏋️</div>
                    <p className='text-[#6B7280] text-center text-sm md:text-base'>No workouts saved yet</p>
                </div>
            ) : (
                workouts.map((workout) => {
                    const programName = programs[workout.program]?.name || workout.program;
                    return (
                        <div key={workout.id} className='p-4 flex flex-col bg-[#1A1A1A] rounded-xl gap-3 border border-gray-800'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-[#00C950] text-lg md:text-xl font-bold capitalize'>{workout.title}</h1>
                                <div className='text-[#6B7280] text-xs md:text-sm font-medium'>{workout.date}</div>
                            </div>

                            <div className='flex items-center gap-2 text-[#6B7280] text-sm'>
                                <span className='px-2 py-1 bg-[#0a0a0a] rounded-lg text-xs font-medium'>{programName}</span>
                                <span className='text-gray-600'>•</span>
                                <span className='font-mono'>{workout.duration}</span>
                            </div>

                            <div className='mt-2 pt-3 border-t border-gray-800'>
                                <p className='text-[#6B7280] text-xs md:text-sm font-semibold mb-3'>Exercises ({workout.exercises.length}):</p>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    {workout.exercises.map((exercise, index) => (
                                        <div key={index} className='flex items-center gap-2 text-[#6B7280] text-xs md:text-sm bg-[#0a0a0a] p-2 rounded-lg'>
                                            <span className='text-green-400'>•</span>
                                            <span className='flex-1'>{exercise.name}</span>
                                            {(exercise.weight > 0 || exercise.sets > 0 || exercise.reps > 0) && (
                                                <span className='text-gray-500 text-xs'>
                                                    {exercise.weight > 0 && `${exercise.weight}kg`}
                                                    {exercise.weight > 0 && (exercise.sets > 0 || exercise.reps > 0) && ' · '}
                                                    {exercise.sets > 0 && `${exercise.sets}x${exercise.reps}`}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  )
}
