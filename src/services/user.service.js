import api from "./api";

/*
========================================
User Service Layer
========================================
Handles all user-related API calls
========================================
*/

/**
 * Get logged-in user profile
 * GET /api/users/profile
 */
export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

/**
 * Update logged-in user profile
 * PUT /api/users/profile
 */
export const updateUserProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

/**
 * Delete user by ID (admin or self-delete)
 * DELETE /api/users/:id
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};