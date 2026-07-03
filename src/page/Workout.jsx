import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { programs } from '../data/programs';
import { exercises } from '../data/exercises';
import { useDispatch } from 'react-redux';
import { addWorkout } from '../features/history';

export default function Workout() {
  const { program: programId, day } = useParams();
  const muscleGroups = programs[programId].days[day];
  const workoutExercises = muscleGroups.flatMap(
  muscleGroup => exercises[muscleGroup]
);
const [seconds, setSeconds] = useState(0);
const [exerciseData, setExerciseData] = useState({});
const [showSuccess, setShowSuccess] = useState(false);

useEffect(() => {
    const timer = setInterval(() => {
        setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
}, []);
const minutes = Math.floor(seconds / 60);

const sec = seconds % 60;
const dispatch = useDispatch();

const handleInputChange = (exerciseId, field, value) => {
  setExerciseData(prev => ({
    ...prev,
    [exerciseId]: {
      ...prev[exerciseId],
      [field]: value
    }
  }));
};

const handleSave = () => {
  const exercisesWithDetails = workoutExercises.map(exercise => ({
    ...exercise,
    weight: exerciseData[exercise.id]?.weight || 0,
    sets: exerciseData[exercise.id]?.sets || 3,
    reps: exerciseData[exercise.id]?.reps || 10
  }));

  dispatch(
    addWorkout({
      id: Date.now(),
      title: day,
      program: programId,
      duration: `${minutes}:${sec.toString().padStart(2, "0")}`,
      date: new Date().toLocaleDateString(),
      exercises: exercisesWithDetails,
    })
  );
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};


  return (
 <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-green-400">
          Workout
        </h2>

       <p>
    {minutes}:{sec.toString().padStart(2, "0")} 
</p>
      </div>

      <div className="space-y-4">
  {workoutExercises.map((exercise) => (
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
                onChange={(e) => handleInputChange(exercise.id, 'weight', e.target.value)}
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
                onChange={(e) => handleInputChange(exercise.id, 'sets', e.target.value)}
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
                onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-[#111] px-3 py-2 text-center text-white"
              />
            </div>
          </div>
        </div>
      </div>
  ))}
      </div>

      <button
      onClick={handleSave}
        className="mt-4 w-full rounded-xl bg-green-500 py-4 text-lg font-semibold text-green-950 transition hover:bg-green-600"
      >
        Save Workout
      </button>

      <div className={showSuccess ? "py-2 text-center text-sm text-green-400" : "hidden py-2 text-center text-sm text-green-400"}>
        Workout Saved Successfully!
      </div>
    </div>
  )
}
