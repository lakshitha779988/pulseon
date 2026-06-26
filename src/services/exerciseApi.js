const API_BASE_URL = "https://oss.exercisedb.dev/api/v1";

// Helper to safely extract data from wrapped responses
const extractData = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const result = await response.json();
  
  // V1 API wraps everything in { success, data } or { success, meta, data }
  if (result && Array.isArray(result.data)) {
    return result.data;
  }
  if (result && result.data && !Array.isArray(result.data)) {
    return result.data;
  }
  if (Array.isArray(result)) {
    return result;
  }
  
  throw new Error("Unexpected API response format");
};

// Helper to normalize list items (handle both strings and {name: "..."} objects)
const normalizeList = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(item => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && item.name) return item.name;
    return String(item);
  });
};

// ==================== EXERCISES ====================

export const fetchExercises = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString 
    ? `${API_BASE_URL}/exercises?${queryString}` 
    : `${API_BASE_URL}/exercises`;
    
  const response = await fetch(url);
  return extractData(response);
};

export const searchExercises = async (searchTerm, threshold = 0.5) => {
  const params = new URLSearchParams({ search: searchTerm });
  if (threshold !== undefined) params.append("threshold", threshold);
  
  const response = await fetch(`${API_BASE_URL}/exercises/search?${params}`);
  return extractData(response);
};

export const fetchExercisesByBodyParts = async (bodyParts, limit = 10) => {
  const params = new URLSearchParams({ 
    bodyParts: Array.isArray(bodyParts) ? bodyParts.join(",") : bodyParts,
    limit 
  });
  
  const response = await fetch(`${API_BASE_URL}/exercises/bodyparts?${params}`);
  return extractData(response);
};

export const fetchExercisesByMuscles = async (targetMuscles, secondaryMuscles, limit = 10) => {
  const params = new URLSearchParams({ limit });
  if (targetMuscles) {
    params.append("targetMuscles", Array.isArray(targetMuscles) ? targetMuscles.join(",") : targetMuscles);
  }
  if (secondaryMuscles) {
    params.append("secondaryMuscles", Array.isArray(secondaryMuscles) ? secondaryMuscles.join(",") : secondaryMuscles);
  }
  
  const response = await fetch(`${API_BASE_URL}/exercises/muscles?${params}`);
  return extractData(response);
};

export const fetchExercisesByEquipments = async (equipments, limit = 10) => {
  const params = new URLSearchParams({ 
    equipments: Array.isArray(equipments) ? equipments.join(",") : equipments,
    limit 
  });
  
  const response = await fetch(`${API_BASE_URL}/exercises/equipments?${params}`);
  return extractData(response);
};

export const fetchExerciseById = async (exerciseId) => {
  const response = await fetch(`${API_BASE_URL}/exercises/${exerciseId}`);
  return extractData(response);
};

// ==================== LISTS ====================

export const fetchBodyParts = async () => {
  const response = await fetch(`${API_BASE_URL}/bodyparts`);
  const data = await extractData(response);
  return normalizeList(data);
};

export const fetchMuscles = async () => {
  const response = await fetch(`${API_BASE_URL}/muscles`);
  const data = await extractData(response);
  return normalizeList(data);
};

export const fetchEquipments = async () => {
  const response = await fetch(`${API_BASE_URL}/equipments`);
  const data = await extractData(response);
  return normalizeList(data);
};