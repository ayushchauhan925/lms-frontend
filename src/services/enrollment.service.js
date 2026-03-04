import api from "./api";

export const enrollInCourse = async (courseId) => {
  const response = await api.post("/enrollments", { courseId });
  return response.data;
};

export const getMyEnrollments = async () => {
  const response = await api.get("/enrollments/my");
  return response.data;
};

export const getCourseEnrollments = async (courseId) => {
  const response = await api.get(`/enrollments/course/${courseId}`);
  return response.data;
};

// Educator: all enrollments across all owned courses ← NEW
export const getEducatorEnrollments = async () => {
  const response = await api.get("/enrollments/educator/all");
  return response.data;
};