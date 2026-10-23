import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  List,
} from "lucide-react";
import { programs } from "../data/programs";

export default function ProgramDetail() {
  const { id } = useParams();
  const workouts = useSelector((state) => state.history.workouts);
  const [showAllDays, setShowAllDays] = useState(false);

  // لو مفيش id، نعرض كل البرامج
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
                  <h2 className="text-white text-lg font-semibold">
                    {program.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {Object.keys(program.days).join(", ")}
                  </p>
                </div>
                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
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
      <div className="mt-6 text-center text-red-500">Program not found</div>
    );
  }

  const daysArray = Object.entries(program.days);

  // ✅ حساب التمارين اللي خلصت في البرنامج ده
  const completedDays = useMemo(() => {
    if (!workouts) return [];
    return workouts.filter((w) => w.program === id).map((w) => w.title);
  }, [workouts, id]);

  // ✅ تحديد التمرين القادم (أول يوم لسه مخلصتوش، أو أول يوم لو كله خلص)
  const nextWorkout = useMemo(() => {
    const uncompleted = daysArray.find(
      ([dayName]) => !completedDays.includes(dayName),
    );
    return uncompleted || daysArray[0];
  }, [daysArray, completedDays]);

  const nextDayName = nextWorkout ? nextWorkout[0] : null;
  const nextDayMuscles = nextWorkout ? nextWorkout[1] : [];

  return (
    <div className="mt-6 pb-10">
      {/* الهيدر */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0a0a0a] py-4">
        <Link
          to="/programs"
          className="text-white p-2 rounded-full hover:bg-[#1a1a1a] transition"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {program.name}
        </h1>
      </div>

      <div className="mt-4">
        <p className="text-sm md:text-base text-[#6B7280] mb-3">
          Today's Workout
        </p>

        {/* ✅ كارت التمرين القادم */}
        {nextDayName && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 p-5">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Play size={80} />
            </div>

            <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Next Up
            </p>
            <h2 className="text-2xl font-bold text-white capitalize mb-1">
              {nextDayName}
            </h2>
            <p className="text-gray-300 text-sm mb-5 capitalize">
              {nextDayMuscles.join(" & ")}
            </p>

            <Link
              to={`/workout/${id}/${nextDayName}`}
              className="inline-flex items-center gap-2 bg-green-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-green-400 active:scale-95 transition"
            >
              <Play size={18} fill="currentColor" />
              Start Workout
            </Link>
          </div>
        )}

        {/* ✅ زرار عرض/إخفاء باقي التمارين */}
        <button
          onClick={() => setShowAllDays(!showAllDays)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-gray-300 hover:text-white hover:bg-[#222] transition"
        >
          <List size={18} />
          <span>{showAllDays ? "Hide All Days" : "View Other Workouts"}</span>
          {showAllDays ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* ✅ قائمة كل الأيام */}
        {showAllDays && (
          <div className="mt-4 flex flex-col gap-3">
            {daysArray.map(([dayName, muscles]) => {
              const isCompleted = completedDays.includes(dayName);

              return (
                <Link
                  key={dayName}
                  to={`/workout/${id}/${dayName}`}
                  className={`block rounded-xl p-4 transition border ${
                    isCompleted
                      ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                      : "bg-[#1a1a1a] border-transparent hover:bg-[#222]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2
                        className={`text-base md:text-lg font-semibold capitalize ${isCompleted ? "text-gray-300" : "text-white"}`}
                      >
                        {dayName}
                      </h2>
                      <p className="text-xs text-[#6B7280] capitalize mt-0.5">
                        {muscles.join(" & ")}
                      </p>
                    </div>

                    {/* علامة الصح لو التمرين مخلص */}
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-medium hidden sm:block">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#6B7280]">
                        {muscles.length} Muscles
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
