import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { programs } from "../data/programs"

export default function ProgramDetail() {
  const { id } = useParams();

  // If no id is provided, show all programs
  if (!id) {
    return (
      <div className="mt-6">
        <div className="sticky top-0 bg-[#0a0a0a] py-4 z-10">
          <h1 className="text-white text-2xl font-bold">Training Programs</h1>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {Object.entries(programs).map(([key, program]) => (
            <Link
              key={key}
              to={`/programs/${key}`}
              className="block w-full text-left bg-[#1a1a1a] rounded-xl p-4 hover:bg-[#222] transition border border-transparent"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-lg font-semibold">{program.name}</h2>
                  <p className="text-gray-400 text-sm">{Object.keys(program.days).join(', ')}</p>
                </div>
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const program = programs[id];

  if (!program) {
    return (
      <div className="mt-6 text-center text-red-500">
        Program not found
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0a0a0a] py-4">
        <Link to="/programs" className="text-white">
          <ArrowLeft />
        </Link>

        <h1 className="text-xl md:text-2xl font-bold text-white">
          {program.name}
        </h1>
      </div>

      <div className="mt-6">
        <p className="text-base md:text-lg text-[#6B7280]">
          Select workout day
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {Object.entries(program.days).map(([dayName, muscles]) => (
            <Link
              key={dayName}
              to={`/workout/${id}/${dayName}`}
              className="block rounded-xl bg-[#1a1a1a] p-4 transition hover:bg-[#222]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-white capitalize">
                    {muscles.join(' & ')}
                  </h2>
                </div>

                <span className="text-xs md:text-sm text-[#6B7280]">
                  {muscles.length} Muscle Groups
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}