import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuPlus,
  LuDumbbell,
  LuCalendarDays,
  LuTrash2,
  LuPencil,
  LuX,
  LuCheck,
  LuArrowLeft,
  LuListChecks,
  LuZap,
  LuTimer,
} from "react-icons/lu";
import {
  getWorkouts,
  getWorkoutExercises,
  saveWorkout,
  deleteWorkout,
  deleteWorkoutExercise,
  updateWorkoutExercise,
} from "../../services/db";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { SkeletonBlock } from "../../components/Skeleton";
import Stopwatch from "../../components/Stopwatch";
import "./workout.css";

const Workout = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [editingExercise, setEditingExercise] = useState(null);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await getWorkouts();
      setWorkouts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load workouts", err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) return;

    try {
      await saveWorkout({
        name: newWorkoutName.trim(),
        date: new Date().toISOString().split("T")[0],
      });
      setNewWorkoutName("");
      setShowNewWorkoutForm(false);
      loadWorkouts();
    } catch (err) {
      console.error("Failed to create workout", err);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!confirm("Delete this workout and all its exercises?")) return;
    try {
      await deleteWorkout(id);
      if (selectedWorkout?.id === id) {
        setSelectedWorkout(null);
        setExercises([]);
      }
      loadWorkouts();
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  const viewWorkoutDetails = async (workout) => {
    setSelectedWorkout(workout);
    setEditingExercise(null);
    try {
      const exs = await getWorkoutExercises(workout.id);
      setExercises(exs);
    } catch (err) {
      console.error("Failed to load workout exercises", err);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!confirm("Remove this exercise from the workout?")) return;
    try {
      await deleteWorkoutExercise(exerciseId);
      const exs = await getWorkoutExercises(selectedWorkout.id);
      setExercises(exs);
    } catch (err) {
      console.error("Failed to delete exercise", err);
    }
  };

  const startEditExercise = (ex) => {
    setEditingExercise({
      ...ex,
      sets: ex.sets.map((s) => ({ ...s })),
    });
  };

  const updateEditSet = (index, field, value) => {
    const newSets = [...editingExercise.sets];
    newSets[index][field] = Number(value) || 0;
    setEditingExercise({ ...editingExercise, sets: newSets });
  };

  const addEditSet = () => {
    setEditingExercise({
      ...editingExercise,
      sets: [...editingExercise.sets, { reps: 0, weight: 0 }],
    });
  };

  const removeEditSet = (index) => {
    if (editingExercise.sets.length <= 1) return;
    const newSets = editingExercise.sets.filter((_, i) => i !== index);
    setEditingExercise({ ...editingExercise, sets: newSets });
  };

  const saveEditExercise = async () => {
    try {
      await updateWorkoutExercise(editingExercise);
      setEditingExercise(null);
      const exs = await getWorkoutExercises(selectedWorkout.id);
      setExercises(exs);
    } catch (err) {
      console.error("Failed to update exercise", err);
    }
  };

  const getTotalSets = (exs) => exs.reduce((total, ex) => total + (ex.sets?.length || 0), 0);

  const getTotalVolume = (exs) =>
    exs.reduce((total, ex) => {
      return (
        total +
        (ex.sets?.reduce((setTotal, set) => setTotal + (set.reps || 0) * (set.weight || 0), 0) || 0)
      );
    }, 0);

  if (loading) {
    return (
      <div className="workout-page">
        <PageHeader icon={LuDumbbell} eyebrow="Training" title="Workouts" />
        <SkeletonBlock height="52px" radius="999px" style={{ marginBottom: 16 }} />
        <SkeletonBlock height="84px" radius="16px" style={{ marginBottom: 10 }} />
        <SkeletonBlock height="84px" radius="16px" />
      </div>
    );
  }

  if (selectedWorkout) {
    return (
      <div className="workout-page page-fade">
        <button
          className="back-button"
          onClick={() => {
            setSelectedWorkout(null);
            setExercises([]);
            setEditingExercise(null);
          }}
        >
          <LuArrowLeft size={17} />
          <span>Back to workouts</span>
        </button>

        <div className="workout-detail-header">
          <div>
            <h2 className="workout-detail-title">{selectedWorkout.name}</h2>
            <span className="workout-detail-date">
              <LuCalendarDays size={14} /> {selectedWorkout.date}
            </span>
          </div>
          <div className="workout-detail-actions">
            <button className="btn-secondary" onClick={() => setShowTimer((v) => !v)}>
              <LuTimer size={15} /> {showTimer ? "Hide Timer" : "Rest Timer"}
            </button>
            <button className="btn-danger-ghost" onClick={() => handleDeleteWorkout(selectedWorkout.id)}>
              <LuTrash2 size={15} /> Delete
            </button>
          </div>
        </div>

        {showTimer && <Stopwatch onClose={() => setShowTimer(false)} />}

        <div className="workout-summary">
          <div className="card summary-stat">
            <span className="summary-stat-value">{exercises.length}</span>
            <span className="summary-stat-label">Exercises</span>
          </div>
          <div className="card summary-stat">
            <span className="summary-stat-value">{getTotalSets(exercises)}</span>
            <span className="summary-stat-label">Total Sets</span>
          </div>
          <div className="card summary-stat">
            <span className="summary-stat-value">{getTotalVolume(exercises)}</span>
            <span className="summary-stat-label">Volume (kg)</span>
          </div>
        </div>

        <Link to="/exercises" className="btn-secondary add-exercise-link">
          <LuPlus size={16} /> Add Exercise
        </Link>

        {exercises.length === 0 ? (
          <EmptyState
            icon={LuDumbbell}
            title="No exercises yet"
            body="Browse the exercise library and add movements to this workout."
            action={
              <Link to="/exercises" className="btn-primary">
                <LuPlus size={16} /> Browse Exercises
              </Link>
            }
          />
        ) : (
          <div className="exercise-log">
            {exercises.map((ex) => (
              <div key={ex.id} className="card log-card">
                {editingExercise?.id === ex.id ? (
                  <div className="edit-mode">
                    <div className="log-header">
                      <img src={ex.gifUrl} alt={ex.name} className="log-thumb" />
                      <h4>{ex.name}</h4>
                    </div>

                    <div className="sets-editor">
                      {editingExercise.sets.map((set, idx) => (
                        <div key={idx} className="edit-set-row">
                          <span className="set-label">Set {idx + 1}</span>
                          <div className="edit-inputs">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateEditSet(idx, "reps", e.target.value)}
                              placeholder="Reps"
                            />
                            <span>×</span>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateEditSet(idx, "weight", e.target.value)}
                              placeholder="kg"
                            />
                          </div>
                          <button className="remove-edit-set" onClick={() => removeEditSet(idx)}>
                            <LuX size={15} />
                          </button>
                        </div>
                      ))}
                      <button className="add-set-btn" onClick={addEditSet}>
                        <LuPlus size={14} /> Add Set
                      </button>
                    </div>

                    <div className="edit-actions">
                      <button className="btn-secondary" onClick={() => setEditingExercise(null)}>
                        Cancel
                      </button>
                      <button className="btn-primary" onClick={saveEditExercise}>
                        <LuCheck size={15} /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="log-header">
                      <img src={ex.gifUrl} alt={ex.name} className="log-thumb" />
                      <h4>{ex.name}</h4>
                      <div className="log-actions">
                        <button onClick={() => startEditExercise(ex)} aria-label="Edit exercise">
                          <LuPencil size={15} />
                        </button>
                        <button onClick={() => handleDeleteExercise(ex.id)} aria-label="Remove exercise">
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="sets-table">
                      <div className="sets-header">
                        <span>Set</span>
                        <span>Reps</span>
                        <span>Weight</span>
                      </div>
                      {ex.sets?.map((set, idx) => (
                        <div key={idx} className="set-row">
                          <span>{idx + 1}</span>
                          <span>{set.reps}</span>
                          <span>{set.weight} kg</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="workout-page">
      <PageHeader
        icon={LuDumbbell}
        eyebrow="Training"
        title="Workouts"
        subtitle="Create a workout session, then log exercises and sets as you train."
        action={
          !showNewWorkoutForm && (
            <button className="btn-primary" onClick={() => setShowNewWorkoutForm(true)}>
              <LuPlus size={16} /> New Workout
            </button>
          )
        }
      />

      {showNewWorkoutForm && (
        <form onSubmit={createWorkout} className="card new-workout-form">
          <input
            type="text"
            placeholder="Workout name, e.g. Push Day"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            autoFocus
          />
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowNewWorkoutForm(false);
                setNewWorkoutName("");
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      )}

      {workouts.length === 0 ? (
        <EmptyState
          icon={LuListChecks}
          title="No workouts yet"
          body="Create your first workout above, or add an exercise directly from the library."
          action={
            <Link to="/exercises" className="btn-primary">
              <LuPlus size={16} /> Browse Exercises
            </Link>
          }
        />
      ) : (
        <div className="workout-list">
          {workouts.map((workout) => (
            <div key={workout.id} className="card workout-card-wrapper">
              <button className="workout-card" onClick={() => viewWorkoutDetails(workout)}>
                <div className="workout-card-icon">
                  <LuZap size={18} />
                </div>
                <div className="workout-card-text">
                  <h3>{workout.name}</h3>
                  <span className="workout-date">
                    <LuCalendarDays size={13} /> {workout.date}
                  </span>
                </div>
              </button>
              <button
                className="delete-workout-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWorkout(workout.id);
                }}
                aria-label="Delete workout"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workout;
