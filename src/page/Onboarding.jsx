import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setProgram, completeOnboarding } from '../features/program/programSlice'
import { programs } from '../data/programs'

export default function Onboarding() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedProgram, setSelectedProgram] = React.useState(null)

  const handleProgramSelect = (programKey) => {
    setSelectedProgram(programKey)
  }

  const handleContinue = () => {
    if (selectedProgram) {
      dispatch(setProgram(selectedProgram))
      dispatch(completeOnboarding())
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 md:p-6">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
          Welcome to LiftLog
        </h1>
        <p className="text-[#6B7280] text-base md:text-lg">Choose Your Training Program</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {Object.entries(programs).map(([key, program]) => (
          <button
            key={key}
            onClick={() => handleProgramSelect(key)}
            className={`w-full p-4 md:p-6 rounded-2xl border-2 transition-all ${
              selectedProgram === key
                ? 'border-green-500 bg-green-500/10'
                : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-base md:text-lg font-semibold">
                {program.name}
              </span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedProgram === key
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-600'
                }`}
              >
                {selectedProgram === key && (
                  <span className="text-black text-sm">✓</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedProgram}
        className={`mt-8 md:mt-12 w-full max-w-md py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold transition ${
          selectedProgram
            ? 'bg-green-500 text-green-950 hover:bg-green-600'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  )
}
