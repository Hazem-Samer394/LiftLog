import { User } from 'lucide-react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProgram, resetOnboarding } from '../features/program/programSlice'
import { programs } from '../data/programs'

export default function Profile() {
  const dispatch = useDispatch()
  const selectedProgram = useSelector((state) => state.program.selectedProgram)
  const workouts = useSelector((state) => state.history.workouts)
  const [showProgramSelector, setShowProgramSelector] = React.useState(false)

  const handleProgramChange = (programKey) => {
    dispatch(setProgram(programKey))
    setShowProgramSelector(false)
  }

  const handleResetOnboarding = () => {
    dispatch(resetOnboarding())
    window.location.href = '/onboarding'
  }

  const currentProgram = selectedProgram ? programs[selectedProgram] : null

  return (
 <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-100">
        Profile
      </h2>

      <div className="space-y-4 rounded-2xl bg-[#141414] p-5">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
            <User className="h-6 w-6 text-green-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Athlete
            </h3>

            <p className="text-xs text-gray-500">
              {currentProgram ? currentProgram.name : 'No program selected'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Training Program
          </span>

          <button 
            onClick={() => setShowProgramSelector(!showProgramSelector)}
            className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-700"
          >
            {currentProgram ? currentProgram.name : 'Select'}
          </button>
        </div>

        {showProgramSelector && (
          <div className="space-y-2 mt-2">
            {Object.entries(programs).map(([key, program]) => (
              <button
                key={key}
                onClick={() => handleProgramChange(key)}
                className={`w-full p-3 rounded-lg text-left transition ${
                  selectedProgram === key
                    ? 'bg-green-500/20 border border-green-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="text-white text-sm font-medium">
                  {program.name}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Weight Unit
          </span>

          <button className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium transition hover:bg-gray-700">
            kg
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Total Workouts
          </span>

          <span className="font-semibold text-green-400">
            {workouts.length}
          </span>
        </div>

        <button 
          onClick={handleResetOnboarding}
          className="mt-2 w-full rounded-xl border border-gray-700 py-3 text-sm font-medium text-gray-400 transition hover:bg-gray-800"
        >
          Change Program
        </button>

        <button className="mt-2 w-full rounded-xl border border-red-700 py-3 text-sm font-medium text-red-400 transition hover:bg-red-900/20">
          Log Out
        </button>

      </div>
    </div>
  )
}
