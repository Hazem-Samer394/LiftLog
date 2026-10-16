import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { exercises } from "../data/exercises";
import { programs } from "../data/programs";

export default function Exercise() {
  const { id, dayName } = useParams();
  const navigate = useNavigate();

  const decodedDayName = decodeURIComponent(dayName || "");
  const program = programs?.[id];

  // لكل تمرين: { done: [false, false, false] }
  const [workoutData, setWorkoutData] = useState({});
  const [savedMessage, setSavedMessage] = useState(false);

  // قائمة التمارين (بدون تكرار)
  const allExercises = useMemo(() => {
    if (!program) return [];
    const muscleGroups = program.days?.[decodedDayName] || [];
    const list = muscleGroups.flatMap((muscle) => exercises[muscle] || []);

    const unique = [];
    const seen = new Set();
    for (const ex of list) {
      if (!seen.has(ex.id)) {
        seen.add(ex.id);
        unique.push(ex);
      }
    }
    return unique;
  }, [program, decodedDayName]);

  // تهيئة أولية: 3 مجموعات غير محددة
  useEffect(() => {
    const initial = {};
    allExercises.forEach((ex) => {
      initial[ex.id] = { done: [false, false, false] };
    });
    setWorkoutData(initial);
  }, [allExercises]);

  /* ---------- التحكم في المجموعات ---------- */

  // تبديل حالة مجموعة (تم / لم يتم)
  const toggleSet = (exerciseId, setIndex) => {
    setWorkoutData((prev) => {
      const current = prev[exerciseId]?.done || [];
      const newDone = current.map((v, i) => (i === setIndex ? !v : v));
      return { ...prev, [exerciseId]: { done: newDone } };
    });
  };

  // إضافة مجموعة جديدة
  const addSet = (exerciseId) => {
    setWorkoutData((prev) => {
      const current = prev[exerciseId]?.done || [];
      return { ...prev, [exerciseId]: { done: [...current, false] } };
    });
  };

  // حذف آخر مجموعة
  const removeSet = (exerciseId) => {
    setWorkoutData((prev) => {
      const current = prev[exerciseId]?.done || [];
      if (current.length <= 1) return prev;
      return { ...prev, [exerciseId]: { done: current.slice(0, -1) } };
    });
  };

  // حفظ التمرين
  const handleSave = () => {
    const payload = {
      programId: id,
      dayName: decodedDayName,
      date: new Date().toISOString(),
      exercises: allExercises.map((ex) => {
        const done = workoutData[ex.id]?.done || [];
        return {
          id: ex.id,
          name: ex.name,
          sets: done.length,
          completed: done.filter(Boolean).length,
          done,
        };
      }),
    };

    const existing = JSON.parse(localStorage.getItem("workoutHistory") || "[]");
    existing.push(payload);
    localStorage.setItem("workoutHistory", JSON.stringify(existing));

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  /* ---------- حالات خاصة ---------- */

  if (!program) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">⚠️ البرنامج غير موجود</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (allExercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">
            مفيش تمارين لهذا اليوم ({decodedDayName})
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
          >
            رجوع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pb-32 space-y-5">
      {/* الهيدر */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-300 hover:bg-[#252525] transition"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-green-500 capitalize">
            {decodedDayName}
          </h1>
          <p className="text-xs text-gray-500">
            {allExercises.length} تمارين • {program.name || ""}
          </p>
        </div>
      </div>

      {/* قائمة التمارين */}
      {allExercises.map((exercise, index) => {
        const done = workoutData[exercise.id]?.done || [];
        const completedCount = done.filter(Boolean).length;
        const totalSets = done.length;
        const isAllDone = totalSets > 0 && completedCount === totalSets;

        return (
          <div
            key={exercise.id}
            className={`overflow-hidden rounded-2xl bg-[#1a1a1a] border transition ${
              isAllDone
                ? "border-green-500/50 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]"
                : "border-[#252525]"
            }`}
          >
            {/* صورة التمرين */}
            <div className="relative">
              <ExerciseImage src={exercise.image} alt={exercise.name} />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur flex items-center justify-center text-green-400 text-sm font-bold">
                {index + 1}
              </div>

              {/* شارة "مكتمل" */}
              {isAllDone && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold flex items-center gap-1">
                  <span>✓</span>
                  <span>مكتمل</span>
                </div>
              )}
            </div>

            {/* بيانات التمرين */}
            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-green-400 text-base flex-1">
                  {exercise.name}
                </h3>
                <p className="text-xs text-gray-500 whitespace-nowrap mt-1">
                  {completedCount} / {totalSets}
                </p>
              </div>

              {/* صف أزرار المجموعات */}
              <div className="flex items-center flex-wrap gap-3">
                {done.map((isDone, i) => (
                  <button
                    key={i}
                    onClick={() => toggleSet(exercise.id, i)}
                    className={`relative w-12 h-12 rounded-full font-bold text-sm flex items-center justify-center transition-all active:scale-90 ${
                      isDone
                        ? "bg-green-500 text-white shadow-[0_0_15px_-2px_rgba(34,197,94,0.7)]"
                        : "bg-[#111] border-2 border-[#2a2a2a] text-gray-400 hover:border-green-500/50 hover:text-green-400"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </button>
                ))}

                {/* أزرار التحكم */}
                <div className="flex items-center gap-2 ml-1">
                  <button
                    onClick={() => addSet(exercise.id)}
                    className="w-9 h-9 rounded-full bg-[#111] border border-[#2a2a2a] text-green-500 font-bold text-lg hover:bg-[#252525] transition flex items-center justify-center"
                    title="إضافة مجموعة"
                  >
                    +
                  </button>

                  {totalSets > 1 && (
                    <button
                      onClick={() => removeSet(exercise.id)}
                      className="w-9 h-9 rounded-full bg-[#111] border border-[#2a2a2a] text-red-500 font-bold text-lg hover:bg-[#252525] transition flex items-center justify-center"
                      title="حذف آخر مجموعة"
                    >
                      −
                    </button>
                  )}
                </div>
              </div>

              {/* شريط تقدم */}
              {totalSets > 0 && (
                <div className="h-1.5 w-full rounded-full bg-[#111] overflow-hidden">
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

      {/* زر الحفظ الثابت */}
      <div className="fixed bottom-20 left-0 right-0 px-4 md:px-10 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-2xl font-bold text-white transition shadow-lg ${
              savedMessage
                ? "bg-green-500 shadow-green-500/30"
                : "bg-green-600 hover:bg-green-700 shadow-green-600/30"
            }`}
          >
            {savedMessage ? "✓ تم الحفظ بنجاح" : "حفظ التمرين"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   صورة التمرين مع Loading و Fallback
   ============================================================ */
function ExerciseImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="h-56 w-full bg-[#111] flex items-center justify-center">
        <span className="text-5xl opacity-30">🏋️</span>
      </div>
    );
  }

  return (
    <div className="h-56 w-full bg-[#111] relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 border-[3px] border-[#2a2a2a] border-t-green-500 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-56 w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
