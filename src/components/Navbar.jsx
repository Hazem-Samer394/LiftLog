import { Dumbbell } from 'lucide-react'
import React from 'react'

export default function Navbar() {
  return (
    <div className=' flex gap-2'>
       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
                <Dumbbell className="h-6 w-6 text-green-950" />
            </div>
        <h1 className="text-3xl font-bold text-green-500">
  LiftLog
</h1>
<hr  className='border-[#151A21] mt-7'/>
    </div>
  )
}
