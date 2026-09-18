import type { Express, Request, Response } from "express";
import { randomBytes } from "node:crypto";
import { createLocalUser, deleteLocalUser, getUserById, listLocalUsers, updateLocalUser } from "./db";
import { ENV } from "./_core/env";
import { authenticateLocal, expirationFromDate, generateLicenseKey, getAuthenticatedLocalUser, hashLicenseKey, hashPassword, normalizeUsername, publicUser, signLocalSession, verifyLocalSession } from "./local-auth";

const TOKEN_COOKIE = "local_session";

function bearer(req: Request) {
  const value = req.headers.authorization;
  if (value?.startsWith("Bearer ")) return value.slice(7).trim();
  const cookie = req.headers.cookie?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${TOKEN_COOKIE}=`));
  return cookie?.slice(TOKEN_COOKIE.length + 1) ?? null;
}

function setSession(res: Response, token: string) {
  res.setHeader("Set-Cookie", `${TOKEN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${ENV.isProduction ? "; Secure" : ""}`);
}

async function requireLocal(req: Request, res: Response) {
  const user = await getAuthenticatedLocalUser(bearer(req));
  if (!user) { res.status(401).json({ message: "Sessão inválida ou licença expirada." }); return null; }
  return user;
}

export function registerLocalAuthRoutes(app: Express) {
  app.post("/api/local-auth/login", async (req, res) => {
    try {
      const { username, password, licenseKey, deviceId } = req.body as { username?: string; password?: string; licenseKey?: string; deviceId?: string };
      if (!username || !password || !deviceId || deviceId.length < 16) return res.status(400).json({ message: "Login, senha e identificador do dispositivo são obrigatórios." });
      const user = await authenticateLocal(username, password, licenseKey ?? "", deviceId);
      const token = await signLocalSession(user);
      setSession(res, token);
      return res.json({ token, user: publicUser(user) });
    } catch (error) {
      return res.status(401).json({ message: error instanceof Error ? error.message : "Não foi possível entrar." });
    }
  });

  app.get("/api/local-auth/me", async (req, res) => {
    const user = await getAuthenticatedLocalUser(bearer(req));
    if (!user) return res.status(401).json({ message: "Sessão inválida ou licença expirada." });
    return res.json({ user: publicUser(user) });
  });

  app.post("/api/local-auth/logout", (_req, res) => {
    res.setHeader("Set-Cookie", `${TOKEN_COOKIE}=; HttpOnly; SameSite=Lax; Max-Age=0${ENV.isProduction ? "; Secure" : ""}`);
    return res.json({ success: true });
  });

  app.get("/api/local-auth/admin/users", async (req, res) => {
    const owner = await requireLocal(req, res);
    if (!owner) return;
    if (owner.role !== "admin") return res.status(403).json({ message: "Acesso exclusivo do proprietário." });
    return res.json({ users: (await listLocalUsers()).map(publicUser) });
  });

  app.post("/api/local-auth/admin/users", async (req, res) => {
    const owner = await requireLocal(req, res);
    if (!owner) return;
    if (owner.role !== "admin") return res.status(403).json({ message: "Acesso exclusivo do proprietário." });
    try {
      const { username, password, name, expiresAt } = req.body as { username?: string; password?: string; name?: string; expiresAt?: string };
      if (!username || !password || password.length < 8 || !expiresAt) return res.status(400).json({ message: "Informe login, senha com pelo menos 8 caracteres e vencimento." });
      const licenseKey = generateLicenseKey();
      const user = await createLocalUser({ openId: `local_${randomBytes(12).toString("hex")}`, username: normalizeUsername(username), passwordHash: await hashPassword(password), licenseKeyHash: hashLicenseKey(licenseKey), licenseExpiresAt: expirationFromDate(expiresAt), loginMethod: "local", role: "user", name: name?.trim() || null });
      if (!user) return res.status(500).json({ message: "Não foi possível criar o usuário." });
      return res.status(201).json({ user: publicUser(user), licenseKey });
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível criar o usuário." });
    }
  });

  app.patch("/api/local-auth/admin/users/:id", async (req, res) => {
    const owner = await requireLocal(req, res);
    if (!owner) return;
    if (owner.role !== "admin") return res.status(403).json({ message: "Acesso exclusivo do proprietário." });
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Usuário inválido." });
    const { expiresAt, status } = req.body as { expiresAt?: string; status?: "active" | "revoked" };
    const values: Record<string, unknown> = {};
    if (expiresAt) values.licenseExpiresAt = expirationFromDate(expiresAt);
    if (status === "active" || status === "revoked") values.licenseStatus = status;
    if (Object.keys(values).length === 0) return res.status(400).json({ message: "Nenhuma alteração informada." });
    const updated = await updateLocalUser(id, values);
    return updated ? res.json({ user: publicUser(updated) }) : res.status(404).json({ message: "Usuário não encontrado." });
  });

  app.delete("/api/local-auth/admin/users/:id", async (req, res) => {
    const owner = await requireLocal(req, res);
    if (!owner) return;
    if (owner.role !== "admin") return res.status(403).json({ message: "Acesso exclusivo do proprietário." });
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Usuário inválido." });
    const deleted = await deleteLocalUser(id);
    return deleted ? res.json({ success: true }) : res.status(404).json({ message: "Usuário não encontrado." });
  });
}

export { bearer, verifyLocalSession };
