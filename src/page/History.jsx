import React, { useState } from "react";
import { useSelector } from "react-redux";
import { programs } from "../data/programs";

/* ============================================================
   دالة مساعدة: توحيد شكل المجموعات (قديم + جديد)
   ============================================================ */
function normalizeSets(exercise) {
  const rawSets = exercise?.sets;

  // ✅ الشكل الجديد: array of { weight, reps, done }
  if (Array.isArray(rawSets)) {
    return rawSets.map((s) => ({
      weight: Number(s?.weight) || 0,
      reps: Number(s?.reps) || 0,
      done: !!s?.done,
    }));
  }

  // ✅ الشكل القديم: sets رقم، و reps و weight منفصلين
  const setsCount = Number(rawSets) || Number(exercise?.sets) || 0;
  const reps = Number(exercise?.reps) || 0;
  const weight = Number(exercise?.weight) || 0;

  return Array.from({ length: setsCount }, () => ({
    weight,
    reps,
    done: true, // نفترض إنه معمول لأن ده تاريخ
  }));
}

export default function History() {
  const workouts = useSelector((state) => state.history.workouts);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="sticky top-0 bg-[#0a0a0a] py-4 z-10">
        <h1 className="text-white text-xl md:text-2xl font-bold">
          Workout History
        </h1>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏋️</div>
            <p className="text-[#6B7280] text-center text-sm md:text-base">
              No workouts saved yet
            </p>
          </div>
        ) : (
          workouts.map((workout) => {
            const programName =
              programs[workout.program]?.name || workout.program;

            const exercises = workout.exercises || [];

            // ✅ حساب الإحصائيات بأمان
            const totalExercises = exercises.length;

            const totalSets = exercises.reduce(
              (acc, ex) => acc + normalizeSets(ex).length,
              0,
            );

            const completedSets = exercises.reduce((acc, ex) => {
              const sets = normalizeSets(ex);
              return acc + sets.filter((s) => s.done).length;
            }, 0);

            const totalVolume = exercises.reduce((acc, ex) => {
              const sets = normalizeSets(ex);
              const exVolume = sets.reduce(
                (sum, s) => sum + s.weight * s.reps,
                0,
              );
              return acc + exVolume;
            }, 0);

            const isExpanded = expandedId === workout.id;

            return (
              <div
                key={workout.id}
                className="p-4 flex flex-col bg-[#1A1A1A] rounded-xl gap-3 border border-gray-800"
              >
                {/* الهيدر */}
                <div className="flex justify-between items-center">
                  <h1 className="text-[#00C950] text-lg md:text-xl font-bold capitalize">
                    {workout.title}
                  </h1>
                  <div className="text-[#6B7280] text-xs md:text-sm font-medium">
                    {workout.date}
                  </div>
                </div>

                {/* معلومات البرنامج + المدة */}
                <div className="flex items-center gap-2 text-[#6B7280] text-sm flex-wrap">
                  <span className="px-2 py-1 bg-[#0a0a0a] rounded-lg text-xs font-medium">
                    {programName}
                  </span>
                  {workout.duration && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="font-mono">{workout.duration}</span>
                    </>
                  )}
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <StatBadge
                    label="Exercises"
                    value={totalExercises}
                    color="text-blue-400"
                  />
                  <StatBadge
                    label="Sets"
                    value={`${completedSets}/${totalSets}`}
                    color="text-green-400"
                  />
                  <StatBadge
                    label="Volume"
                    value={`${totalVolume}kg`}
                    color="text-orange-400"
                  />
                </div>

                {/* زر عرض التمارين */}
                <button
                  onClick={() => toggleExpand(workout.id)}
                  className="mt-1 w-full py-2.5 rounded-lg bg-[#0a0a0a] border border-gray-800 text-gray-400 text-sm font-semibold hover:border-green-500/40 hover:text-green-400 transition flex items-center justify-center gap-2"
                >
                  <span>{isExpanded ? "▲" : "▼"}</span>
                  <span>
                    {isExpanded
                      ? "إخفاء التمارين"
                      : `عرض التمارين (${totalExercises})`}
                  </span>
                </button>

                {/* تفاصيل التمارين */}
                {isExpanded && (
                  <div className="mt-1 pt-3 border-t border-gray-800 space-y-2">
                    {exercises.map((exercise, index) => {
                      const sets = normalizeSets(exercise);
                      const exVolume = sets.reduce(
                        (sum, s) => sum + s.weight * s.reps,
                        0,
                      );
                      const completed = sets.filter((s) => s.done).length;

                      return (
                        <div
                          key={index}
                          className="bg-[#0a0a0a] p-3 rounded-lg border border-gray-800/50"
                        >
                          {/* اسم التمرين + الإحصائيات */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-green-400 text-sm">●</span>
                              <span className="text-white text-sm font-medium">
                                {exercise.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 whitespace-nowrap">
                              {completed}/{sets.length} • {exVolume}kg
                            </span>
                          </div>

                          {/* قائمة المجموعات */}
                          {sets.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {sets.map((set, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${
                                    set.done
                                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                                      : "bg-[#1a1a1a] text-gray-500 border border-gray-800"
                                  }`}
                                >
                                  <span className="opacity-70">{i + 1}.</span>
                                  <span>
                                    {set.weight}kg × {set.reps}
                                  </span>
                                  {set.done && (
                                    <span className="ml-0.5">✓</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ============================================================
   مكوّن إحصائيات صغير
   ============================================================ */
function StatBadge({ label, value, color = "text-white" }) {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg py-2 px-2 text-center">
      <p className="text-[9px] text-gray-500 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className={`text-xs md:text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}
