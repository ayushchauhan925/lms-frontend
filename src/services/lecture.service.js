import api from "./api";

export const createLecture = async (lectureData) => {
  const response = await api.post("/lectures", lectureData);
  return response.data;
};

export const getLecturesByCourse = async (courseId) => {
  const response = await api.get(`/lectures/course/${courseId}`);
  return response.data;
};

export const getLectureById = async (lectureId) => {
  const response = await api.get(`/lectures/${lectureId}`);
  return response.data;
};

export const updateLecture = async (lectureId, updatedData) => {
  const response = await api.put(`/lectures/${lectureId}`, updatedData);
  return response.data;
};

export const deleteLecture = async (lectureId) => {
  const response = await api.delete(`/lectures/${lectureId}`);
  return response.data;
};