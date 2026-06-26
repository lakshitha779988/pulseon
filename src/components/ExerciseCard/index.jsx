import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import "./exercisecard.css";

const ExerciseCard = ({ exercise }) => {
  return (
    <Link to={`/exercises/${exercise.exerciseId}`} className="exercise-card">
      <div className="exercise-card-media">
        <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
      </div>
      <div className="exercise-card-info">
        <h3 className="exercise-card-title">{exercise.name}</h3>
        <div className="exercise-card-tags">
          {exercise.bodyParts?.[0] && <span className="tag">{exercise.bodyParts[0]}</span>}
          {exercise.targetMuscles?.[0] && (
            <span className="tag tag-muted">{exercise.targetMuscles[0]}</span>
          )}
        </div>
      </div>
      <span className="exercise-card-arrow">
        <LuChevronRight size={18} />
      </span>
    </Link>
  );
};

export default ExerciseCard;
