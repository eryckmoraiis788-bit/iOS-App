import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";

const TOKEN_KEY = "local_auth_token";
const DEVICE_KEY = "local_device_id";
const USER_KEY = "local_auth_user";

export type LocalUser = {
  id: number;
  username: string | null;
  name: string | null;
  role: "user" | "admin";
  licenseExpiresAt: string | null;
  licenseStatus: "active" | "revoked";
  deviceBound: boolean;
  lastSignedIn: string;
  createdAt: string;
};

async function storageGet(key: string) {
  if (Platform.OS === "web") return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  return SecureStore.getItemAsync(key);
}

async function storageSet(key: string, value: string) {
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.setItem(key, value); return; }
  await SecureStore.setItemAsync(key, value);
}

async function storageDelete(key: string) {
  if (Platform.OS === "web") { if (typeof window !== "undefined") window.localStorage.removeItem(key); return; }
  await SecureStore.deleteItemAsync(key);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await storageGet(TOKEN_KEY);
  const response = await fetch(`${getApiBaseUrl()}${path}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers ?? {}) }, credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Não foi possível concluir a operação.");
  return data as T;
}

export async function getDeviceId() {
  let deviceId = await storageGet(DEVICE_KEY);
  if (!deviceId) { deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`; await storageSet(DEVICE_KEY, deviceId); }
  return deviceId;
}

export async function login(username: string, password: string, licenseKey: string) {
  const deviceId = await getDeviceId();
  const result = await request<{ token: string; user: LocalUser }>("/api/local-auth/login", { method: "POST", body: JSON.stringify({ username, password, licenseKey, deviceId }) });
  await storageSet(TOKEN_KEY, result.token);
  await storageSet(USER_KEY, JSON.stringify(result.user));
  return result.user;
}

export async function me() {
  const token = await storageGet(TOKEN_KEY);
  if (!token) return null;
  try { const result = await request<{ user: LocalUser }>("/api/local-auth/me"); await storageSet(USER_KEY, JSON.stringify(result.user)); return result.user; }
  catch { await clearAuth(); return null; }
}

export async function cachedUser() {
  const value = await storageGet(USER_KEY);
  if (!value) return null;
  try { return JSON.parse(value) as LocalUser; } catch { return null; }
}

export async function clearAuth() {
  try { await request("/api/local-auth/logout", { method: "POST" }); } catch { /* session may already be invalid */ }
  await storageDelete(TOKEN_KEY); await storageDelete(USER_KEY);
}

export async function listUsers() { return request<{ users: LocalUser[] }>("/api/local-auth/admin/users"); }
export async function createUser(input: { username: string; password: string; name: string; expiresAt: string }) { return request<{ user: LocalUser; licenseKey: string }>("/api/local-auth/admin/users", { method: "POST", body: JSON.stringify(input) }); }
export async function updateUser(id: number, input: { expiresAt?: string; status?: "active" | "revoked" }) { return request<{ user: LocalUser }>(`/api/local-auth/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(input) }); }
export async function deleteUser(id: number) { return request<{ success: true }>(`/api/local-auth/admin/users/${id}`, { method: "DELETE" }); }
