import api from "./api";

export const issueCertificate = async (courseId) => {
  const response = await api.post("/certificates/issue", { courseId });
  return response.data;
};

export const getMyCertificate = async (courseId) => {
  const response = await api.get(`/certificates/${courseId}`);
  return response.data;
};

export const verifyCertificate = async (certificateNumber) => {
  const response = await api.get(
    `/certificates/verify/${certificateNumber}`
  );
  return response.data;
};