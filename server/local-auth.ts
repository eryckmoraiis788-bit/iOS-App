import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { createLocalUser, getUserById, getUserByUsername, updateLocalUser } from "./db";
import type { User } from "../drizzle/schema";

const scrypt = promisify(scryptCallback);
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

type LocalSession = { userId: number; role: "user" | "admin"; username: string };

function secretKey() {
  const secret = ENV.cookieSecret;
  if (!secret || secret.length < 32) throw new Error("JWT_SECRET precisa ter pelo menos 32 caracteres.");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashLicenseKey(key: string) {
  return createHash("sha256").update(key.trim().toUpperCase()).digest("hex");
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function expirationFromDate(date: string) {
  const parsed = new Date(`${date}T23:59:59.999Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error("Data de vencimento inválida.");
  return parsed;
}

export function isLicenseValid(user: User) {
  return user.role === "admin" || (user.licenseStatus === "active" && !!user.licenseExpiresAt && user.licenseExpiresAt.getTime() >= Date.now());
}

export async function signLocalSession(user: User) {
  if (!user.username) throw new Error("Usuário local sem login.");
  return new SignJWT({ userId: user.id, role: user.role, username: user.username })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifyLocalSession(token: string | null | undefined): Promise<LocalSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "number" || (payload.role !== "user" && payload.role !== "admin") || typeof payload.username !== "string") return null;
    return { userId: payload.userId, role: payload.role, username: payload.username };
  } catch {
    return null;
  }
}

export async function ensureOwnerAccount() {
  if (!ENV.adminUsername || !ENV.adminPassword) return getUserByUsername("__missing_owner__");
  const username = normalizeUsername(ENV.adminUsername);
  const current = await getUserByUsername(username);
  if (current) return current;
  return createLocalUser({
    openId: `local_admin_${randomBytes(8).toString("hex")}`,
    username,
    passwordHash: await hashPassword(ENV.adminPassword),
    loginMethod: "local",
    role: "admin",
    name: "Proprietário",
  });
}

export async function authenticateLocal(usernameInput: string, password: string, licenseKey: string, deviceId: string) {
  const username = normalizeUsername(usernameInput);
  await ensureOwnerAccount();
  const user = await getUserByUsername(username);
  if (!user || !user.passwordHash || user.loginMethod !== "local" || !(await verifyPassword(password, user.passwordHash))) throw new Error("Usuário ou senha inválidos.");
  if (user.role !== "admin" && (!licenseKey || !user.licenseKeyHash || hashLicenseKey(licenseKey) !== user.licenseKeyHash)) throw new Error("Chave de licença inválida.");
  if (!isLicenseValid(user)) throw new Error("A licença está vencida ou foi revogada.");
  if (user.deviceId && user.deviceId !== deviceId) throw new Error("Esta licença já está vinculada a outro dispositivo.");
  const updated = await updateLocalUser(user.id, { deviceId, lastSignedIn: new Date() });
  if (!updated) throw new Error("Não foi possível atualizar o acesso.");
  return updated;
}

export async function getAuthenticatedLocalUser(token: string | null | undefined) {
  const session = await verifyLocalSession(token);
  if (!session) return null;
  const user = await getUserById(session.userId);
  return user && user.username === session.username && isLicenseValid(user) ? user : null;
}

export function generateLicenseKey() {
  return `${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}-${randomBytes(2).toString("hex")}`.toUpperCase();
}

type PublicUserSource = Pick<User, "id" | "username" | "name" | "role" | "licenseExpiresAt" | "licenseStatus" | "deviceId" | "lastSignedIn" | "createdAt">;

export function publicUser(user: PublicUserSource) {
  return { id: user.id, username: user.username, name: user.name, role: user.role, licenseExpiresAt: user.licenseExpiresAt, licenseStatus: user.licenseStatus, deviceBound: !!user.deviceId, lastSignedIn: user.lastSignedIn, createdAt: user.createdAt };
}
