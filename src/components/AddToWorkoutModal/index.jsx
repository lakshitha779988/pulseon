import { useState, useEffect } from "react";
import { LuX, LuPlus, LuTrash2, LuCheck } from "react-icons/lu";
import { getWorkouts, saveWorkout, saveWorkoutExercise } from "../../services/db";
import "./addtoworkoutmodal.css";

const AddToWorkoutModal = ({ exercise, onClose }) => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load workouts", err);
    }
  };

  const addSet = () => setSets([...sets, { reps: "", weight: "" }]);

  const removeSet = (index) => setSets(sets.filter((_, i) => i !== index));

  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleSave = async () => {
    if (!isCreatingNew && !selectedWorkoutId) {
      alert("Please select a workout or create a new one");
      return;
    }

    setSaving(true);
    try {
      let workoutId;

      if (isCreatingNew) {
        if (!newWorkoutName.trim()) {
          alert("Please enter a workout name");
          setSaving(false);
          return;
        }
        workoutId = await saveWorkout({
          name: newWorkoutName.trim(),
          date: new Date().toISOString().split("T")[0],
        });
      } else {
        workoutId = Number(selectedWorkoutId);
      }

      await saveWorkoutExercise({
        workoutId,
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        bodyParts: exercise.bodyParts,
        targetMuscles: exercise.targetMuscles,
        sets: sets.map((s) => ({
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
        })),
        createdAt: new Date().toISOString(),
      });

      setSaved(true);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Failed to save workout", err);
      alert("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add to Workout</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <LuX size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="exercise-preview">
            <img src={exercise.gifUrl} alt={exercise.name} />
            <h4>{exercise.name}</h4>
          </div>

          <div className="workout-selection">
            <h4>Select Workout</h4>

            {!isCreatingNew ? (
              <>
                <select
                  value={selectedWorkoutId}
                  onChange={(e) => setSelectedWorkoutId(e.target.value)}
                  className="workout-select"
                >
                  <option value="">-- Choose a workout --</option>
                  {workouts.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.date})
                    </option>
                  ))}
                </select>
                <button className="create-new-link" onClick={() => setIsCreatingNew(true)}>
                  <LuPlus size={14} /> Create New Workout
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Workout name (e.g., Push Day)"
                  value={newWorkoutName}
                  onChange={(e) => setNewWorkoutName(e.target.value)}
                  className="new-workout-input"
                  autoFocus
                />
                <button
                  className="create-new-link"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewWorkoutName("");
                  }}
                >
                  ← Back to existing workouts
                </button>
              </>
            )}
          </div>

          <h4 className="sets-title">Sets</h4>
          {sets.map((set, index) => (
            <div key={index} className="set-row-modal">
              <div className="set-inputs">
                <div className="input-group">
                  <label>Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(index, "reps", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(index, "weight", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              {sets.length > 1 && (
                <button className="remove-set-btn" onClick={() => removeSet(index)} aria-label="Remove set">
                  <LuTrash2 size={15} />
                </button>
              )}
            </div>
          ))}

          <button className="add-set-btn" onClick={addSet}>
            <LuPlus size={14} /> Add Set
          </button>
        </div>

        <div className="modal-footer">
          {saved ? (
            <button className="btn-primary is-saved-state" disabled>
              <LuCheck size={16} /> Saved!
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save to Workout"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToWorkoutModal;
