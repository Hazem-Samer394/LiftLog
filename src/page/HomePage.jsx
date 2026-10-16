import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { programs } from "../data/programs";

export default function HomePage() {
  const navigate = useNavigate();
  const onboardingCompleted = useSelector(
    (state) => state.program.onboardingCompleted,
  );
  const selectedProgram = useSelector((state) => state.program.selectedProgram);
  const workouts = useSelector((state) => state.history.workouts);

  const [inProgress, setInProgress] = useState(null);

  // تحقق من وجود تمرين قيد التنفيذ
  useEffect(() => {
    const saved = localStorage.getItem("inProgressWorkout");
    if (saved) {
      try {
        setInProgress(JSON.parse(saved));
      } catch {
        localStorage.removeItem("inProgressWorkout");
      }
    }
  }, []);

  useEffect(() => {
    if (!onboardingCompleted) {
      navigate("/onboarding");
    }
  }, [onboardingCompleted, navigate]);

  if (!onboardingCompleted) return null;

  const currentProgramName = selectedProgram
    ? programs[selectedProgram]?.name
    : "No program selected";

  const handleQuickStart = () => {
    if (selectedProgram) {
      const programData = programs[selectedProgram];
      const firstDay = Object.keys(programData.days)[0];
      navigate(`/workout/${selectedProgram}/${firstDay}`);
    }
  };

  const handleContinue = () => {
    if (inProgress) {
      navigate(
        `/workout/${inProgress.programId}/${encodeURIComponent(
          inProgress.dayName,
        )}`,
      );
    }
  };

  const handleDiscardInProgress = () => {
    localStorage.removeItem("inProgressWorkout");
    setInProgress(null);
  };

  // حساب ملخص كل تمرين
  const getWorkoutSummary = (workout) => {
    const totalExercises = workout.exercises?.length || 0;
    const totalSets = workout.exercises?.reduce(
      (acc, ex) => acc + (ex.sets?.length || 0),
      0,
    );
    return { totalExercises, totalSets };
  };

  return (
    <div className="mt-6 rounded-2xl">
      {/* الهيدر */}
      <div className="bg-[#141414] p-4 md:p-6 rounded-2xl gap-1 flex flex-col">
        <p className="text-[#6B7280] text-sm md:text-base">Ready to train?</p>
        <h1 className="text-white text-xl md:text-2xl font-bold">
          Today's Workout
        </h1>
        <span className="text-[#6B7280] text-sm md:text-base">
          {currentProgramName}
        </span>
      </div>

      {/* بطاقة "Continue" لو فيه تمرين قيد التنفيذ */}
      {inProgress && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-green-400 text-xs font-semibold uppercase tracking-wide">
                  تمرين قيد التنفيذ
                </p>
              </div>
              <h3 className="text-white font-bold text-base md:text-lg capitalize truncate">
                {inProgress.dayName}
              </h3>
              <p className="text-[#6B7280] text-xs mt-0.5">ابدأ من حيث توقفت</p>
            </div>

            <button
              onClick={handleDiscardInProgress}
              className="text-[#6B7280] hover:text-red-400 text-xs px-2 py-1 rounded transition flex-shrink-0"
              title="إلغاء التمرين"
            >
              ✕
            </button>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-green-500 text-black font-semibold py-3 rounded-xl hover:bg-green-400 active:scale-95 transition text-sm md:text-base"
          >
            ▶ استكمال التمرين
          </button>
        </div>
      )}

      {/* زر Quick Start */}
      {!inProgress && (
        <div className="mt-5">
          <button
            onClick={handleQuickStart}
            className="bg-[#22C55E] text-black font-semibold px-4 py-3 md:py-3 w-full cursor-pointer rounded-2xl text-base md:text-lg hover:bg-green-400 active:scale-95 transition"
          >
            Quick Start Workout
          </button>
        </div>
      )}

      {/* آخر التمارين */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#6B7280] text-lg md:text-xl font-medium">
            Recent Workouts
          </span>
          {workouts.length > 3 && (
            <button
              onClick={() => navigate("/history")}
              className="text-green-500 text-xs md:text-sm font-semibold hover:text-green-400 transition"
            >
              عرض الكل ←
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {workouts.length === 0 ? (
            <div className="text-center py-8 bg-[#141414] rounded-2xl border border-gray-800/50">
              <div className="text-4xl mb-2">🏋️</div>
              <p className="text-[#6B7280] text-sm md:text-base">
                مفيش تمارين لسه
              </p>
              <p className="text-[#4B5563] text-xs mt-1">
                ابدأ أول تمرين ليك دلوقتي
              </p>
            </div>
          ) : (
            [...workouts]
              .reverse()
              .slice(0, 3)
              .map((workout) => {
                const { totalExercises, totalSets } =
                  getWorkoutSummary(workout);
                const programName =
                  programs[workout.program]?.name || workout.program;

                return (
                  <button
                    key={workout.id}
                    onClick={() => navigate("/history")}
                    className="flex bg-[#1A1A1A] hover:bg-[#222] px-3 py-3 gap-3 rounded-xl justify-between items-center transition text-left w-full border border-gray-800/50 hover:border-green-500/20"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-sm">✓</span>
                        </div>
                        <h1 className="font-semibold text-white text-sm md:text-base capitalize truncate">
                          {workout.title}
                        </h1>
                      </div>

                      <div className="flex items-center gap-2 text-[#6B7280] text-xs pl-10">
                        <span className="truncate">{programName}</span>
                        <span className="text-gray-700">•</span>
                        <span>{totalExercises} تمارين</span>
                        {totalSets > 0 && (
                          <>
                            <span className="text-gray-700">•</span>
                            <span>{totalSets} مجموعة</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[#6B7280] text-xs">
                        {workout.date}
                      </div>
                      {workout.duration && (
                        <div className="text-green-500/70 text-xs font-mono mt-0.5">
                          {workout.duration}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
