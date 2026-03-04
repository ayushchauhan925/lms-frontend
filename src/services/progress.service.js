import api from "./api";

export const markLectureCompleted = async (courseId, lectureId) => {
  const response = await api.post("/progress/complete", {
    courseId,
    lectureId,
  });
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const response = await api.get(`/progress/${courseId}`);
  return response.data;
};

/**
 * Get all progress records for the logged-in student.
 * Returns progressList where each item has:
 *  - progressPercentage
 *  - courseId (populated: title, category, thumbnail, educatorId, level)
 * GET /api/progress/my
 */
export const getMyProgress = async () => {
  const response = await api.get("/progress/my");
  return response.data;
};