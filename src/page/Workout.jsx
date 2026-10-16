import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { programs } from "../data/programs";
import { exercises } from "../data/exercises";
import { useDispatch } from "react-redux";
import { addWorkout } from "../features/history";

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
  const [timerRunning, setTimerRunning] = useState(false); // ✅ التايمر واقف افتراضي
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
  }, [programId, decodedDay, workoutExercises.length]);

  // ✅ التايمر بيشتغل بس لما timerRunning = true
  useEffect(() => {
    if (!timerRunning) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  if (!program || !program.days?.[decodedDay]) {
    return (
      <div className="p-4">
        <p className="text-red-500">⚠️ البرنامج أو اليوم غير موجود</p>
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

    // ✅ نرجع للصفحة الرئيسية
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

        {/* التايمر */}
        <div className="flex items-center gap-2">
          <p
            className={`font-mono text-lg ${
              timerRunning ? "text-white" : "text-gray-500"
            }`}
          >
            {minutes}:{sec.toString().padStart(2, "0")}
          </p>

          {/* ✅ زرار ابدأ/إيقاف */}
          <button
            onClick={() => setTimerRunning((r) => !r)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition active:scale-90 ${
              timerRunning
                ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                : "bg-green-500 text-white hover:bg-green-600 shadow-[0_0_15px_-2px_rgba(34,197,94,0.6)]"
            }`}
            title={timerRunning ? "إيقاف المؤقت" : "ابدأ المؤقت"}
          >
            {timerRunning ? (
              // أيقونة إيقاف
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
              // أيقونة تشغيل
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

      {/* نص توضيحي تحت الهيدر */}
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
                    <span>مكتمل</span>
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

      {/* زر الحفظ */}
      <button
        onClick={handleSave}
        disabled={showSuccess}
        className={`mt-4 w-full rounded-xl py-4 text-lg font-semibold transition active:scale-95 ${
          showSuccess
            ? "bg-green-500/30 text-green-300 cursor-not-allowed"
            : "bg-green-500 text-green-950 hover:bg-green-600"
        }`}
      >
        {showSuccess ? "✓ تم الحفظ - العودة للرئيسية..." : "Save Workout"}
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
                  المجموعة {editingSet.setIndex + 1}
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
                    الوزن (kg)
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
                    العدات
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
                حجم المجموعة:{" "}
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
                {editingSetData.done ? "↺ إلغاء التحديد" : "✓ تم أداء المجموعة"}
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
                    حذف المجموعة
                  </button>
                )}

                <button
                  onClick={() => setEditingSet(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-[#252525] transition text-sm"
                >
                  تم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
