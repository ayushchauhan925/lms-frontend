import api from "./api";

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const getAllPublishedCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getAllCourses = async () => {
  const response = await api.get("/courses/all");
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const updateCourse = async (id, updatedData) => {
  const response = await api.patch(`/courses/${id}`, updatedData);
  return response.data;
};

export const publishCourse = async (id) => {
  const response = await api.patch(`/courses/${id}/publish`);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

export const getMyCourses = async () => {
  const response = await api.get("/courses/my");
  return response.data;
};