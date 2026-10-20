import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { programs } from "../data/programs";
import { exercises } from "../data/exercises";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout } from "../features/history";
import { Dumbbell, RefreshCcwDot } from "lucide-react";

export default function Workout() {
  const { program: programId, day } = useParams();
  const navigate = useNavigate();

  // لو مفيش params → حوّل تلقائياً لأول برنامج وأول يوم
  useEffect(() => {
    if (!programId || !day) {
      const firstProgramKey = Object.keys(programs)[0];
      if (!firstProgramKey) return;

      const firstProgram = programs[firstProgramKey];
      const firstDayKey = Object.keys(firstProgram.days)[0];
      if (!firstDayKey) return;

      navigate(
        `/workout/${firstProgramKey}/${encodeURIComponent(firstDayKey)}`,
        { replace: true },
      );
    }
  }, [programId, day, navigate]);

  if (!programId || !day) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <WorkoutSession programId={programId} day={day} />;
}

/* ============================================================
   جلسة التمرين
   ============================================================ */
function WorkoutSession({ programId, day }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const decodedDay = decodeURIComponent(day);
  const program = programs[programId];
  const workouts = useSelector((state) => state.history.workouts);

  // قائمة التمارين (بدون تكرار)
  const workoutExercises = useMemo(() => {
    if (!program || !program.days?.[decodedDay]) return [];
    const muscleGroups = program.days[decodedDay];
    const raw = muscleGroups.flatMap((mg) => exercises[mg] || []);

    const seen = new Set();
    const unique = [];
    for (const ex of raw) {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        unique.push(ex);
      }
    }
    return unique;
  }, [program, decodedDay]);

  /* ---------- كل الـ Hooks في الأول ---------- */
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exerciseData, setExerciseData] = useState({});
  const [editingSet, setEditingSet] = useState(null);

  // تهيئة عند فتح التمرين
  useEffect(() => {
    const initial = {};
    workoutExercises.forEach((ex) => {
      initial[ex.id] = {
        sets: Array.from({ length: 3 }, () => ({
          weight: 0,
          reps: 10,
          done: false,
        })),
      };
    });
    setExerciseData(initial);
    setSeconds(0);
    setTimerRunning(false);
    setShowSuccess(false);
    setEditingSet(null);
  }, [programId, decodedDay, workoutExercises]);

  // التايمر
  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  if (!program || !program.days?.[decodedDay]) {
    return (
      <div className="p-4">
        <p className="text-red-500">⚠️ Program or day not found</p>
      </div>
    );
  }

  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  /* ---------- التحكم في المجموعات ---------- */
  const toggleSetDone = (exerciseId, setIndex) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      const newSets = sets.map((s, i) =>
        i === setIndex ? { ...s, done: !s.done } : s,
      );
      return { ...prev, [exerciseId]: { sets: newSets } };
    });
  };

  const updateSetField = (exerciseId, setIndex, field, value) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      const newSets = sets.map((s, i) =>
        i === setIndex ? { ...s, [field]: value } : s,
      );
      return { ...prev, [exerciseId]: { sets: newSets } };
    });
  };

  const addSet = (exerciseId) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      const last = sets[sets.length - 1] || { weight: 0, reps: 10 };
      return {
        ...prev,
        [exerciseId]: {
          sets: [
            ...sets,
            { weight: last.weight, reps: last.reps, done: false },
          ],
        },
      };
    });
  };

  const removeSet = (exerciseId, setIndex) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      if (sets.length <= 1) return prev;
      const newSets = sets.filter((_, i) => i !== setIndex);
      return { ...prev, [exerciseId]: { sets: newSets } };
    });
  };

  /* ---------- الحفظ ---------- */
  const handleSave = () => {
    const exercisesWithDetails = workoutExercises.map((exercise) => {
      const sets = exerciseData[exercise.id]?.sets || [];
      return {
        ...exercise,
        sets,
        totalSets: sets.length,
        completedSets: sets.filter((s) => s.done).length,
      };
    });

    const now = new Date();
    const dayNum = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${dayNum}/${month}/${year}`;

    dispatch(
      addWorkout({
        id: Date.now(),
        title: decodedDay,
        program: programId,
        duration: `${minutes}:${sec.toString().padStart(2, "0")}`,
        date: dateStr,
        exercises: exercisesWithDetails,
      }),
    );

    setShowSuccess(true);

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1200);
  };

  /* ---------- بيانات المودال ---------- */
  const editingExercise = editingSet
    ? workoutExercises.find((e) => e.id === editingSet.exerciseId)
    : null;

  const editingSetData = editingSet
    ? exerciseData[editingSet.exerciseId]?.sets[editingSet.setIndex]
    : null;

  /* ---------- دالة جلب آخر أداء ---------- */
  const getLastPerformance = (exerciseId) => {
    const reversedWorkouts = [...workouts].reverse();

    for (const w of reversedWorkouts) {
      const ex = w.exercises?.find((e) => e.id === exerciseId);
      if (ex && ex.sets && ex.sets.length > 0) {
        const bestSet = ex.sets.reduce(
          (prev, current) =>
            Number(prev.weight) > Number(current.weight) ? prev : current,
          ex.sets[0],
        );

        let formattedDate = w.date;
        if (w.date && w.date.includes("/")) {
          const [d, m, y] = w.date.split("/");
          const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC",
          ];
          formattedDate = `${months[Number(m) - 1]} ${d}`;
        }

        return {
          weight: bestSet.weight || 0,
          reps: bestSet.reps || 0,
          date: formattedDate,
        };
      }
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      {/* الهيدر + التايمر + زرار التحكم */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-green-400">Workout</h2>
          <p className="text-xs text-gray-500 capitalize truncate">
            {decodedDay}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p
            className={`font-mono text-lg ${
              timerRunning ? "text-white" : "text-gray-500"
            }`}
          >
            {minutes}:{sec.toString().padStart(2, "0")}
          </p>

          <button
            onClick={() => setTimerRunning((r) => !r)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition active:scale-90 ${
              timerRunning
                ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                : "bg-green-500 text-white hover:bg-green-600 shadow-[0_0_15px_-2px_rgba(34,197,94,0.6)]"
            }`}
            title={timerRunning ? "Stop Timer" : "Start Timer"}
          >
            {timerRunning ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* نص توضيحي */}
      {!timerRunning && seconds === 0 && (
        <div className="text-center py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400">
            Tap <span className="text-green-400 font-semibold">▶</span> to start
            the timer
          </p>
        </div>
      )}

      {/* قائمة التمارين */}
      <div className="space-y-4">
        {workoutExercises.map((exercise) => {
          const sets = exerciseData[exercise.id]?.sets || [];
          const completedCount = sets.filter((s) => s.done).length;
          const totalSets = sets.length;
          const isAllDone = totalSets > 0 && completedCount === totalSets;

          return (
            <div
              key={exercise.id}
              className={`overflow-hidden rounded-2xl bg-[#1a1a1a] border transition ${
                isAllDone
                  ? "border-green-500/50 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]"
                  : "border-gray-800"
              }`}
            >
              <div className="relative h-48 md:h-56 w-full bg-[#222] flex items-center justify-center">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="text-gray-500 text-center p-4"><span class="text-4xl">🏋️</span><p class="mt-2 text-sm">${exercise.name}</p></div>`;
                  }}
                />
                {isAllDone && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                    <span>✓</span>
                    <span>Complete</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-green-400 text-lg flex-1">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap mt-1.5">
                    {completedCount} / {totalSets}
                  </p>
                </div>

                {(() => {
                  const lastPerf = getLastPerformance(exercise.id);

                  if (!lastPerf) {
                    return (
                      <div className="py-2">
                        <h2 className="text-[#6B7271] font-semibold">
                          Last Workout
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          No previous data
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div>
                        <h2 className="text-[#6B7271] font-semibold">
                          Last Workout
                        </h2>
                        <div className="mt-3 flex justify-between items-center bg-[#222]/30 rounded-xl p-2">
                          {/* ✅ تعديل عرض الوزن */}
                          <div className="flex flex-1 justify-center gap-2 items-center">
                            <Dumbbell
                              className="w-8 h-8 md:w-10 md:h-10"
                              color="#6B7271"
                            />
                            {Number(lastPerf.weight) > 0 ? (
                              <span className="text-white font-bold text-2xl md:text-3xl">
                                {lastPerf.weight}{" "}
                                <span className="text-sm text-gray-400">
                                  kg
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium text-sm md:text-base">
                                Not recorded
                              </span>
                            )}
                          </div>

                          <div className="h-8 w-[2px] bg-gray-700"></div>

                          {/* ✅ تعديل عرض العدات */}
                          <div className="flex flex-1 justify-center gap-2 items-center">
                            <RefreshCcwDot
                              className="w-8 h-8 md:w-10 md:h-10"
                              color="#6B7271"
                            />
                            {Number(lastPerf.reps) > 0 ? (
                              <span className="text-white font-bold text-2xl md:text-3xl">
                                {lastPerf.reps}{" "}
                                <span className="text-sm text-gray-400">
                                  reps
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium text-sm md:text-base">
                                Not recorded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <h2 className="text-[#6B7271] font-semibold text-sm">
                          Last Time .
                        </h2>
                        <span className="text-[#6B7271] text-xs font-mono">
                          {lastPerf.date}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-start flex-wrap gap-3">
                  {sets.map((set, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => toggleSetDone(exercise.id, i)}
                        className={`w-12 h-12 rounded-full font-bold text-sm flex items-center justify-center transition-all active:scale-90 ${
                          set.done
                            ? "bg-green-500 text-white shadow-[0_0_15px_-2px_rgba(34,197,94,0.7)]"
                            : "bg-[#0a0a0a] border-2 border-gray-700 text-gray-400 hover:border-green-500/50 hover:text-green-400"
                        }`}
                      >
                        {set.done ? "✓" : i + 1}
                      </button>

                      <button
                        onClick={() =>
                          setEditingSet({
                            exerciseId: exercise.id,
                            setIndex: i,
                          })
                        }
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition ${
                          set.done
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-gray-500 hover:bg-[#252525] hover:text-gray-300"
                        }`}
                      >
                        {set.weight || set.reps
                          ? `${set.weight}×${set.reps}`
                          : "— × —"}
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={() => addSet(exercise.id)}
                      className="w-9 h-9 rounded-full bg-[#0a0a0a] border border-gray-700 text-green-500 font-bold text-lg hover:bg-[#252525] transition flex items-center justify-center"
                    >
                      +
                    </button>

                    {totalSets > 1 && (
                      <button
                        onClick={() => removeSet(exercise.id, totalSets - 1)}
                        className="w-9 h-9 rounded-full bg-[#0a0a0a] border border-gray-700 text-red-500 font-bold text-lg hover:bg-[#252525] transition flex items-center justify-center"
                      >
                        −
                      </button>
                    )}
                  </div>
                </div>

                {totalSets > 0 && (
                  <div className="h-1.5 w-full rounded-full bg-[#0a0a0a] overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{
                        width: `${(completedCount / totalSets) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        disabled={showSuccess}
        className={`mt-4 w-full rounded-xl py-4 text-lg font-semibold transition active:scale-95 ${
          showSuccess
            ? "bg-green-500/30 text-green-300 cursor-not-allowed"
            : "bg-green-500 text-green-950 hover:bg-green-600"
        }`}
      >
        {showSuccess ? "✓ Saved — Back to Home..." : "Save Workout"}
      </button>

      {showSuccess && (
        <div className="py-3 text-center text-sm text-green-400 bg-green-500/10 rounded-xl border border-green-500/30">
          Workout Saved Successfully!
        </div>
      )}

      {/* مودال تعديل المجموعة */}
      {editingSet && editingSetData && editingExercise && (
        <div
          onClick={() => setEditingSet(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-md bg-[#151515] border-t md:border border-gray-800 md:rounded-2xl rounded-t-3xl"
          >
            <div className="flex items-start justify-between p-5 border-b border-gray-800">
              <div className="flex-1 pr-3">
                <p className="text-xs text-gray-500 mb-1">
                  {editingExercise.name}
                </p>
                <h2 className="text-lg font-bold text-green-400">
                  Set {editingSet.setIndex + 1}
                </h2>
              </div>
              <button
                onClick={() => setEditingSet(null)}
                className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#252525] hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs text-gray-500 uppercase tracking-wide">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={editingSetData.weight}
                    onChange={(e) =>
                      updateSetField(
                        editingSet.exerciseId,
                        editingSet.setIndex,
                        "weight",
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-3 text-center text-white text-lg font-semibold focus:border-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-gray-500 uppercase tracking-wide">
                    Reps
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={editingSetData.reps}
                    onChange={(e) =>
                      updateSetField(
                        editingSet.exerciseId,
                        editingSet.setIndex,
                        "reps",
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-3 text-center text-white text-lg font-semibold focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-center text-xs text-gray-500">
                Set Volume:{" "}
                <span className="text-green-400 font-semibold">
                  {(Number(editingSetData.weight) || 0) *
                    (Number(editingSetData.reps) || 0)}{" "}
                  kg
                </span>
              </p>
            </div>

            <div className="p-5 pt-0 space-y-3">
              <button
                onClick={() => {
                  toggleSetDone(editingSet.exerciseId, editingSet.setIndex);
                  setEditingSet(null);
                }}
                className={`w-full py-3.5 rounded-xl font-bold transition ${
                  editingSetData.done
                    ? "bg-[#1a1a1a] border border-gray-700 text-gray-300 hover:bg-[#252525]"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {editingSetData.done ? "↺ Undo Set" : "✓ Mark as Done"}
              </button>

              <div className="flex gap-3">
                {exerciseData[editingSet.exerciseId]?.sets.length > 1 && (
                  <button
                    onClick={() => {
                      removeSet(editingSet.exerciseId, editingSet.setIndex);
                      setEditingSet(null);
                    }}
                    className="flex-1 py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition text-sm"
                  >
                    Delete Set
                  </button>
                )}

                <button
                  onClick={() => setEditingSet(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-[#252525] transition text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
