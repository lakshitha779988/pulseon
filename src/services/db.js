import { openDB } from "idb";

const DB_NAME = "fitness-tracker-db";
const DB_VERSION = 3;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("waterRecords")) {
      db.createObjectStore("waterRecords", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("workouts")) {
      db.createObjectStore("workouts", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("workoutExercises")) {
      const store = db.createObjectStore("workoutExercises", { keyPath: "id", autoIncrement: true });
      store.createIndex("workoutId", "workoutId", { unique: false });
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings");
    }
    if (!db.objectStoreNames.contains("calorieRecords")) {
      db.createObjectStore("calorieRecords", { keyPath: "id", autoIncrement: true });
    }
  },
});

export default dbPromise;

// ==================== WATER ====================
export const saveWaterRecord = async (record) => {
  const db = await dbPromise;
  return db.add("waterRecords", { ...record, createdAt: new Date().toISOString() });
};

export const getWaterRecords = async () => {
  const db = await dbPromise;
  return db.getAll("waterRecords");
};

// ==================== WORKOUTS ====================
export const saveWorkout = async (workout) => {
  const db = await dbPromise;
  return db.add("workouts", {
    ...workout,
    createdAt: new Date().toISOString(),
  });
};

export const getWorkouts = async () => {
  const db = await dbPromise;
  return db.getAll("workouts");
};

export const getWorkoutById = async (id) => {
  const db = await dbPromise;
  return db.get("workouts", Number(id));
};

export const updateWorkout = async (workout) => {
  const db = await dbPromise;
  return db.put("workouts", workout);
};

export const deleteWorkout = async (id) => {
  const db = await dbPromise;
  // Delete all exercises in this workout first
  const exercises = await getWorkoutExercises(id);
  for (const ex of exercises) {
    await db.delete("workoutExercises", ex.id);
  }
  return db.delete("workouts", id);
};

// ==================== WORKOUT EXERCISES ====================
export const saveWorkoutExercise = async (exercise) => {
  const db = await dbPromise;
  return db.add("workoutExercises", exercise);
};

export const getWorkoutExercises = async (workoutId) => {
  const db = await dbPromise;
  return db.getAllFromIndex("workoutExercises", "workoutId", Number(workoutId));
};

export const updateWorkoutExercise = async (exercise) => {
  const db = await dbPromise;
  return db.put("workoutExercises", exercise);
};

export const deleteWorkoutExercise = async (id) => {
  const db = await dbPromise;
  return db.delete("workoutExercises", id);
};

// ==================== SETTINGS ====================
export const saveSetting = async (key, value) => {
  const db = await dbPromise;
  return db.put("settings", value, key);
};

export const getSetting = async (key) => {
  const db = await dbPromise;
  return db.get("settings", key);
};

// ==================== CALORIES ====================
export const saveCalorieEntry = async (entry) => {
  const db = await dbPromise;
  return db.add("calorieRecords", { ...entry, createdAt: new Date().toISOString() });
};

export const getCalorieEntries = async () => {
  const db = await dbPromise;
  return db.getAll("calorieRecords");
};

export const deleteCalorieEntry = async (id) => {
  const db = await dbPromise;
  return db.delete("calorieRecords", id);
};