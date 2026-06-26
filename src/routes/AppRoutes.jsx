import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Water from "../pages/Water";
import Workout from "../pages/Workout";
import Exercises from "../pages/Exercises";
import ExerciseDetail from "../pages/Exercises/ExerciseDetail";
import Progress from "../pages/Progress";
import Calories from "../pages/Calories";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/water" element={<Water />} />
      <Route path="/workout" element={<Workout />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/exercises/:id" element={<ExerciseDetail />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/calories" element={<Calories />} />
    </Routes>
  );
};

export default AppRoutes;
