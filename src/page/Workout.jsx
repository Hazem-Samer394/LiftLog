import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { programs } from "../data/programs";
import { exercises } from "../data/exercises";
import { useDispatch, useSelector } from "react-redux";
import { addWorkout } from "../features/history";
import { Dumbbell, RefreshCcwDot } from "lucide-react";

function ExerciseImage({ src, alt }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="h-full w-full bg-[#222] flex flex-col items-center justify-center text-gray-500 p-4">
        <span className="text-4xl">🏋️</span>
        <p className="mt-2 text-sm text-center">{alt}</p>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setError(true)}
    />
  );
}

export default function Workout() {
  const { program: programId, day } = useParams();
  const navigate = useNavigate();

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

function WorkoutSession({ programId, day }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const decodedDay = decodeURIComponent(day);
  const program = programs[programId];
  const workouts = useSelector((state) => state.history.workouts);

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

  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exerciseData, setExerciseData] = useState({});
  const [editingSet, setEditingSet] = useState(null);

  // تهيئة
  useEffect(() => {
    const initial = {};
    workoutExercises.forEach((ex) => {
      initial[ex.id] = {
        sets: Array.from({ length: 3 }, () => ({
          weight: "",
          reps: "",
          done: false,
        })),
      };
    });
    setExerciseData(initial);
    setSeconds(0);
    setTimerRunning(false);
    setShowSuccess(false);
    setEditingSet(null);
  }, [programId, decodedDay]);

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

  const toggleSetDone = (exerciseId, setIndex) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      return {
        ...prev,
        [exerciseId]: {
          sets: sets.map((s, i) =>
            i === setIndex ? { ...s, done: !s.done } : s,
          ),
        },
      };
    });
  };

  const addSet = (exerciseId) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      const last = sets[sets.length - 1] || { weight: "", reps: "" };
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
      return {
        ...prev,
        [exerciseId]: { sets: sets.filter((_, i) => i !== setIndex) },
      };
    });
  };

  const updateSetFromModal = (exerciseId, setIndex, weight, reps) => {
    setExerciseData((prev) => {
      const sets = prev[exerciseId]?.sets || [];
      return {
        ...prev,
        [exerciseId]: {
          sets: sets.map((s, i) =>
            i === setIndex ? { ...s, weight, reps } : s,
          ),
        },
      };
    });
  };

  const handleSave = () => {
    const exercisesWithDetails = workoutExercises.map((exercise) => {
      const sets = (exerciseData[exercise.id]?.sets || []).map((s) => ({
        ...s,
        weight: Number(s.weight) || 0,
        reps: Number(s.reps) || 0,
      }));
      return {
        ...exercise,
        sets,
        totalSets: sets.length,
        completedSets: sets.filter((s) => s.done).length,
      };
    });

    const now = new Date();
    // بنسجل التاريخ مع الوقت عشان نعرف نفرق بين التمارين
    const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

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
    setTimeout(() => navigate("/", { replace: true }), 1200);
  };

  // جلب آخر تمرينة من الهيستوري
  const getLastPerformance = (exerciseId) => {
    if (!workouts || workouts.length === 0) return null;

    // ترتيب التمارين تنازلياً (الأحدث الأول)
    const sortedWorkouts = [...workouts].sort((a, b) => b.id - a.id);

    for (const w of sortedWorkouts) {
      const ex = w.exercises?.find((e) => e.id === exerciseId);
      if (ex) {
        let lastSet = null;

        if (Array.isArray(ex.sets) && ex.sets.length > 0) {
          const validSets = ex.sets.filter(
            (s) => Number(s.weight) > 0 || Number(s.reps) > 0,
          );
          if (validSets.length > 0) {
            lastSet = validSets[validSets.length - 1];
          }
        } else if (typeof ex.sets === "number" && ex.sets > 0) {
          lastSet = { weight: ex.weight || 0, reps: ex.reps || 0 };
        }

        if (lastSet) {
          let formattedDate = w.date || "";
          if (formattedDate.includes("/")) {
            const [datePart] = formattedDate.split(" ");
            const [d, m] = datePart.split("/");
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
            weight: lastSet.weight || 0,
            reps: lastSet.reps || 0,
            date: formattedDate,
          };
        }
      }
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-green-400">Workout</h2>
          <p className="text-xs text-gray-500 capitalize truncate">
            {decodedDay}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={`font-mono text-lg ${timerRunning ? "text-white" : "text-gray-500"}`}
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

      {!timerRunning && seconds === 0 && (
        <div className="text-center py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400">
            Tap <span className="text-green-400 font-semibold">▶</span> to start
            the timer
          </p>
        </div>
      )}

      <div className="space-y-4">
        {workoutExercises.map((exercise) => {
          const sets = exerciseData[exercise.id]?.sets || [];
          const completedCount = sets.filter((s) => s.done).length;
          const totalSets = sets.length;
          const isAllDone = totalSets > 0 && completedCount === totalSets;

          return (
            <div
              key={exercise.id}
              className={`overflow-hidden rounded-2xl bg-[#1a1a1a] border transition ${isAllDone ? "border-green-500/50 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]" : "border-gray-800"}`}
            >
              <div className="relative h-48 md:h-56 w-full bg-[#222] flex items-center justify-center">
                <ExerciseImage src={exercise.image} alt={exercise.name} />
                {isAllDone && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                    <span>✓</span> <span>Complete</span>
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

                  const hasWeight = Number(lastPerf.weight) > 0;

                  return (
                    <div>
                      <h2 className="text-[#6B7271] font-semibold">
                        Last Workout
                      </h2>
                      <div className="mt-3 flex justify-between items-center bg-[#222]/30 rounded-xl p-2">
                        {hasWeight ? (
                          <>
                            <div className="flex flex-1 justify-center gap-2 items-center">
                              <Dumbbell
                                className="w-8 h-8 md:w-10 md:h-10"
                                color="#6B7271"
                              />
                              <span className="text-white font-bold text-2xl md:text-3xl">
                                {lastPerf.weight}{" "}
                                <span className="text-sm text-gray-400">
                                  kg
                                </span>
                              </span>
                            </div>

                            <div className="h-8 w-[2px] bg-gray-700"></div>

                            <div className="flex flex-1 justify-center gap-2 items-center">
                              <RefreshCcwDot
                                className="w-8 h-8 md:w-10 md:h-10"
                                color="#6B7271"
                              />
                              <span className="text-white font-bold text-2xl md:text-3xl">
                                {lastPerf.reps}{" "}
                                <span className="text-sm text-gray-400">
                                  reps
                                </span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex w-full justify-center items-center py-2">
                            <span className="text-gray-500 font-medium text-sm md:text-base">
                              Weight Not Recorded
                            </span>
                          </div>
                        )}
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
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition ${set.done ? "text-green-400 hover:bg-green-500/10" : "text-gray-500 hover:bg-[#252525] hover:text-gray-300"}`}
                      >
                        {Number(set.weight) > 0 || Number(set.reps) > 0
                          ? `${Number(set.weight) || 0}×${Number(set.reps) || 0}`
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

      {editingSet && (
        <EditSetModal
          key={`${editingSet.exerciseId}-${editingSet.setIndex}`}
          editingSet={editingSet}
          exerciseData={exerciseData}
          exercises={workoutExercises}
          onClose={() => setEditingSet(null)}
          updateSetFromModal={updateSetFromModal}
          toggleSetDone={toggleSetDone}
          removeSet={removeSet}
        />
      )}
    </div>
  );
}

/* ============================================================
   المودال (بيستخدم useRef عشان يمنع أي هنج)
   ============================================================ */
function EditSetModal({
  editingSet,
  exerciseData,
  exercises,
  onClose,
  updateSetFromModal,
  toggleSetDone,
  removeSet,
}) {
  const exercise = exercises.find((e) => e.id === editingSet.exerciseId);
  const data = exerciseData[editingSet.exerciseId]?.sets[editingSet.setIndex];

  const weightRef = useRef(null);
  const repsRef = useRef(null);

  useEffect(() => {
    if (weightRef.current) weightRef.current.focus();
  }, []);

  if (!data || !exercise) return null;

  const handleSaveChanges = () => {
    const w = weightRef.current ? weightRef.current.value : "";
    const r = repsRef.current ? repsRef.current.value : "";
    updateSetFromModal(editingSet.exerciseId, editingSet.setIndex, w, r);
    onClose();
  };

  return (
    <div
      onClick={handleSaveChanges}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-md bg-[#151515] border-t md:border border-gray-800 md:rounded-2xl rounded-t-3xl"
      >
        <div className="flex items-start justify-between p-5 border-b border-gray-800">
          <div className="flex-1 pr-3">
            <p className="text-xs text-gray-500 mb-1">{exercise.name}</p>
            <h2 className="text-lg font-bold text-green-400">
              Set {editingSet.setIndex + 1}
            </h2>
          </div>
          <button
            onClick={handleSaveChanges}
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
                ref={weightRef}
                type="text"
                inputMode="decimal"
                defaultValue={data?.weight || ""}
                placeholder="0"
                className="w-full rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-3 text-center text-white text-lg font-semibold focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-500 uppercase tracking-wide">
                Reps
              </label>
              <input
                ref={repsRef}
                type="text"
                inputMode="numeric"
                defaultValue={data?.reps || ""}
                placeholder="0"
                className="w-full rounded-lg border border-gray-700 bg-[#0a0a0a] px-3 py-3 text-center text-white text-lg font-semibold focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-5 pt-0 space-y-3">
          <button
            onClick={() => {
              toggleSetDone(editingSet.exerciseId, editingSet.setIndex);
              handleSaveChanges();
            }}
            className={`w-full py-3.5 rounded-xl font-bold transition ${data.done ? "bg-[#1a1a1a] border border-gray-700 text-gray-300 hover:bg-[#252525]" : "bg-green-500 hover:bg-green-600 text-white"}`}
          >
            {data.done ? "↺ Undo Set" : "✓ Mark as Done"}
          </button>
          <div className="flex gap-3">
            {exerciseData[editingSet.exerciseId]?.sets.length > 1 && (
              <button
                onClick={() => {
                  removeSet(editingSet.exerciseId, editingSet.setIndex);
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition text-sm"
              >
                Delete Set
              </button>
            )}
            <button
              onClick={handleSaveChanges}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-[#252525] transition text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
