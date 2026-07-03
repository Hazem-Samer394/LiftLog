import React from 'react'
import { Link } from 'react-router-dom'
import { programs } from '../data/programs'

export default function Programs() {
  return (
    <div className='mt-6'>
        <div className='sticky top-0 bg-[#0a0a0a] py-4 z-10'>
            <h1 className='text-white text-2xl font-bold'>Training Programs</h1>
        </div>
        <div className='mt-4 flex flex-col gap-4'>
            {Object.entries(programs).map(([key, program]) => (
                <Link key={key} to={`/programs/${key}`} className='block w-full text-left bg-[#1a1a1a] rounded-xl p-4 hover:bg-[#222] transition border border-transparent'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='text-white text-lg font-semibold'>{program.name}</h2>
                            <p className='text-gray-400 text-sm'>{Object.keys(program.days).join(', ')}</p>
                        </div>
                        <div className='text-gray-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}
