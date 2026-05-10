import { apiClient } from "./api";

export async function signup(payload) {
  return apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  const data = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  localStorage.setItem("authToken", data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem("authToken");
}