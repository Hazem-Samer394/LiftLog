import { exercises } from "../data/exercises";
import { useParams } from "react-router-dom";
import { programs } from "../data/programs";

export default function Exercise() {
  const { id, dayName } = useParams();
  const program = programs[id];
  
  if (!program) {
    return <div className="p-4 text-red-500">Program not found</div>;
  }

  const muscleGroups = program.days[dayName];
  
  // Get all exercises for the muscle groups of this day
  const allExercises = muscleGroups.flatMap(muscle => exercises[muscle] || []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 space-y-5">
      <h1 className="mb-6 text-3xl font-bold text-green-500 capitalize">
        {dayName}
      </h1>

      {allExercises.map((exercise) => (
        <div
          key={exercise.id}
          className="overflow-hidden rounded-2xl bg-[#1a1a1a]"
        >
          <img
            src={exercise.image}
            alt={exercise.name}
            className="h-56 w-full object-cover"
          />

          <div className="space-y-3 p-4">
            <h3 className="font-semibold text-green-400">
              {exercise.name}
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Weight
                </label>

                <input
                  type="number"
                  defaultValue={0}
                  className="w-full rounded-lg border border-gray-800 bg-[#111] px-3 py-2 text-center text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Sets
                </label>

                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-lg border border-gray-800 bg-[#111] px-3 py-2 text-center text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-500">
                  Reps
                </label>

                <input
                  type="number"
                  defaultValue={10}
                  className="w-full rounded-lg border border-gray-800 bg-[#111] px-3 py-2 text-center text-white"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}