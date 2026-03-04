import api from "./api";

// Student: submit a new review
export const createReview = async (courseId, rating, comment) => {
  const response = await api.post("/reviews", { courseId, rating, comment });
  return response.data; // { success, message, data: review }
};

// Student: get all their own reviews
export const getMyReviews = async () => {
  const response = await api.get("/reviews/my");
  return response.data; // { success, count, data: reviews[] }
};

// Student: update their own review
export const updateReview = async (reviewId, updatedData) => {
  const response = await api.put(`/reviews/${reviewId}`, updatedData);
  return response.data; // { success, message, data: review }
};

// Student: delete their own review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data; // { success, message }
};

// Public: get approved reviews for a course
export const getCourseReviews = async (courseId) => {
  const response = await api.get(`/reviews/course/${courseId}`);
  return response.data; // { success, count, data: reviews[] }
};

// Educator: get all reviews for their own course (protected, ownership verified on backend)
export const getEducatorCourseReviews = async (courseId) => {
  const response = await api.get(`/reviews/educator/course/${courseId}`);
  return response.data; // { success, count, data: reviews[] }
};