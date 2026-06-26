import { useState, useEffect } from "react";
import {
  LuSearch,
  LuSlidersHorizontal,
  LuX,
  LuRotateCcw,
} from "react-icons/lu";
import {
  fetchExercises,
  searchExercises,
  fetchExercisesByBodyParts,
  fetchExercisesByMuscles,
  fetchExercisesByEquipments,
  fetchBodyParts,
  fetchMuscles,
  fetchEquipments,
} from "../../services/exerciseApi";
import PageHeader from "../../components/PageHeader";
import ExerciseCard from "../../components/ExerciseCard";
import EmptyState from "../../components/EmptyState";
import { SkeletonBlock } from "../../components/Skeleton";
import "./exercises.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bodyParts, setBodyParts] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [bp, mus, eq] = await Promise.all([
          fetchBodyParts(),
          fetchMuscles(),
          fetchEquipments(),
        ]);
        setBodyParts(bp);
        setMuscles(mus);
        setEquipments(eq);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    setLoading(true);
    setError(null);
    setSelectedBodyPart("");
    setSelectedMuscle("");
    setSelectedEquipment("");
    setActiveFilters([]);
    try {
      const data = await fetchExercises({ limit: 10 });
      setExercises(data);
    } catch (err) {
      setError("Failed to load exercises.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadExercises();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchExercises(searchQuery, 0.5);
      setExercises(data);
    } catch (err) {
      setError("Search failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setIsDrawerOpen(false);
    setLoading(true);
    setError(null);

    const filters = [];
    if (selectedBodyPart) filters.push({ type: "Body Part", value: selectedBodyPart });
    if (selectedMuscle) filters.push({ type: "Muscle", value: selectedMuscle });
    if (selectedEquipment) filters.push({ type: "Equipment", value: selectedEquipment });
    setActiveFilters(filters);

    try {
      let data = [];

      if (selectedBodyPart) {
        data = await fetchExercisesByBodyParts(selectedBodyPart, 10);
      } else if (selectedMuscle) {
        data = await fetchExercisesByMuscles(selectedMuscle, null, 10);
      } else if (selectedEquipment) {
        data = await fetchExercisesByEquipments(selectedEquipment, 10);
      } else {
        data = await fetchExercises({ limit: 10 });
      }

      setExercises(data);
    } catch (err) {
      setError("Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedBodyPart("");
    setSelectedMuscle("");
    setSelectedEquipment("");
    setActiveFilters([]);
    loadExercises();
    setIsDrawerOpen(false);
  };

  const removeFilter = (filterType) => {
    if (filterType === "Body Part") setSelectedBodyPart("");
    if (filterType === "Muscle") setSelectedMuscle("");
    if (filterType === "Equipment") setSelectedEquipment("");

    const remaining = activeFilters.filter((f) => f.type !== filterType);
    setActiveFilters(remaining);

    if (remaining.length === 0) {
      loadExercises();
      return;
    }
    applyFilters();
  };

  return (
    <div className="exercises-page">
      <PageHeader
        icon={LuSearch}
        eyebrow="Library"
        title="Find your next exercise"
        subtitle="Search by name or filter by body part, target muscle, and equipment."
      />

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrap">
          <LuSearch size={17} className="search-input-icon" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="btn-primary search-btn">
          Search
        </button>
      </form>

      <div className="filter-bar">
        <button className="filter-toggle-btn" onClick={() => setIsDrawerOpen(true)}>
          <LuSlidersHorizontal size={15} /> Filters
        </button>

        {activeFilters.length > 0 && (
          <div className="active-filter-tags">
            {activeFilters.map((filter) => (
              <span key={filter.type} className="filter-tag">
                {filter.type}: {filter.value}
                <button onClick={() => removeFilter(filter.type)} aria-label={`Remove ${filter.type} filter`}>
                  <LuX size={13} />
                </button>
              </span>
            ))}
            <button className="clear-all-btn" onClick={clearFilters}>
              <LuRotateCcw size={13} /> Clear all
            </button>
          </div>
        )}
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <div className="exercise-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="card exercise-skeleton" key={i}>
              <SkeletonBlock height="140px" radius="12px" style={{ marginBottom: 12 }} />
              <SkeletonBlock height="14px" width="70%" style={{ marginBottom: 8 }} />
              <SkeletonBlock height="12px" width="40%" />
            </div>
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={LuSearch}
          title="No exercises found"
          body="Try a different search term or clear your filters to see more results."
          action={
            <button className="btn-secondary" onClick={loadExercises}>
              Reset search
            </button>
          }
        />
      ) : (
        <div className="exercise-grid">
          {exercises.map((exercise) => (
            <ExerciseCard exercise={exercise} key={exercise.exerciseId} />
          ))}
        </div>
      )}

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Filter Exercises</h3>
              <button className="drawer-close" onClick={() => setIsDrawerOpen(false)} aria-label="Close filters">
                <LuX size={18} />
              </button>
            </div>

            <div className="drawer-content">
              <div className="filter-field">
                <label>Body Part</label>
                <select value={selectedBodyPart} onChange={(e) => setSelectedBodyPart(e.target.value)}>
                  <option value="">All Body Parts</option>
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>
                      {part}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Target Muscle</label>
                <select value={selectedMuscle} onChange={(e) => setSelectedMuscle(e.target.value)}>
                  <option value="">All Muscles</option>
                  {muscles.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Equipment</label>
                <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)}>
                  <option value="">All Equipment</option>
                  {equipments.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn-secondary" onClick={clearFilters}>
                Reset
              </button>
              <button className="btn-primary" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
