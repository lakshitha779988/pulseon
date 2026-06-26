import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LuPlus, LuActivity, LuListOrdered, LuLayers } from "react-icons/lu";
import { fetchExerciseById } from "../../services/exerciseApi";
import BackButton from "../../components/BackButton";
import AddToWorkoutModal from "../../components/AddToWorkoutModal";
import { SkeletonBlock } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import "./exercisedetail.css";

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true);
      try {
        const data = await fetchExerciseById(id);
        setExercise(data);
      } catch (err) {
        setError("Failed to load exercise details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="exercise-detail-page">
        <BackButton />
        <SkeletonBlock height="260px" radius="20px" style={{ marginBottom: 18 }} />
        <SkeletonBlock height="22px" width="60%" style={{ marginBottom: 20 }} />
        <SkeletonBlock height="120px" radius="16px" />
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="exercise-detail-page">
        <BackButton />
        <EmptyState
          icon={LuActivity}
          title={error ? "Something went wrong" : "Exercise not found"}
          body={error || "We couldn't find details for this exercise."}
        />
      </div>
    );
  }

  return (
    <div className="exercise-detail-page page-fade">
      <BackButton />

      <div className="detail-hero card">
        <img src={exercise.gifUrl} alt={exercise.name} className="detail-gif" />
      </div>

      <div className="detail-title-row">
        <h1 className="detail-title">{exercise.name}</h1>
        <button className="btn-primary add-workout-btn" onClick={() => setShowModal(true)}>
          <LuPlus size={16} /> Add to Workout
        </button>
      </div>

      <div className="card detail-card">
        <h3 className="section-title">
          <LuLayers size={16} /> Details
        </h3>
        <div className="detail-rows">
          <div className="detail-row">
            <span className="detail-row-label">Body Part</span>
            <div className="tag-list">
              {exercise.bodyParts?.map((bp) => (
                <span key={bp} className="tag">
                  {bp}
                </span>
              ))}
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Target Muscle</span>
            <div className="tag-list">
              {exercise.targetMuscles?.map((m) => (
                <span key={m} className="tag">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Equipment</span>
            <div className="tag-list">
              {exercise.equipments?.map((eq) => (
                <span key={eq} className="tag">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {exercise.instructions?.length > 0 && (
        <div className="card detail-card">
          <h3 className="section-title">
            <LuListOrdered size={16} /> Instructions
          </h3>
          <ol className="instructions-list">
            {exercise.instructions.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {exercise.secondaryMuscles?.length > 0 && (
        <div className="card detail-card">
          <h3 className="section-title">Secondary Muscles</h3>
          <div className="tag-list">
            {exercise.secondaryMuscles.map((muscle) => (
              <span key={muscle} className="tag">
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}

      {showModal && <AddToWorkoutModal exercise={exercise} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ExerciseDetail;
