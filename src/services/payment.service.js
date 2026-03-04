import api from "./api";

export const createPayment = async (courseId) => {
  const response = await api.post("/payments", { courseId });
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get("/payments/my");
  return response.data;
};

export const getPaymentByCourse = async (courseId) => {
  const response = await api.get(`/payments/course/${courseId}`);
  return response.data;
};

// Educator: fetch earnings dashboard  ← NEW
export const getEducatorEarnings = async () => {
  const response = await api.get("/payments/educator/earnings");
  return response.data;
};