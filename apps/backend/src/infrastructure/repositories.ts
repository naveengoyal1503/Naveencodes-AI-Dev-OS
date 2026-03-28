import type { Pool, RowDataPacket } from "mysql2/promise";

import type { UserRole } from "@naveencodes/core";

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserApiKeyRecord {
  provider: string;
  encryptedKey: string;
  iv: string;
  authTag: string;
  keyHint: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  userId: string;
  name: string;
  targetUrl: string;
  environment: "production" | "staging" | "preview";
  status: string;
  seoScore: number;
  performanceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  status: string;
  metadataJson: string | null;
  createdAt: string;
}

type UserRow = RowDataPacket & {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};

type ApiKeyRow = RowDataPacket & {
  provider: string;
  encrypted_key: string;
  iv: string;
  auth_tag: string;
  key_hint: string;
  updated_at: Date;
};

type ProjectRow = RowDataPacket & {
  id: string;
  user_id: string;
  name: string;
  target_url: string;
  environment: "production" | "staging" | "preview";
  status: string;
  seo_score: number;
  performance_score: number;
  created_at: Date;
  updated_at: Date;
};

type ActivityRow = RowDataPacket & {
  id: string;
  user_id: string;
  type: string;
  title: string;
  status: string;
  metadata_json: string | null;
  created_at: Date;
};

function toIsoDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at)
  };
}

function mapProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    targetUrl: row.target_url,
    environment: row.environment,
    status: row.status,
    seoScore: row.seo_score,
    performanceScore: row.performance_score,
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at)
  };
}

function mapActivity(row: ActivityRow): ActivityLogRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    status: row.status,
    metadataJson: row.metadata_json,
    createdAt: toIsoDate(row.created_at)
  };
}

export async function findUserByEmail(pool: Pool, email: string) {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function findUserById(pool: Pool, id: string) {
  const [rows] = await pool.query<UserRow[]>(
    "SELECT id, full_name, email, password_hash, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function createUser(
  pool: Pool,
  input: { id: string; fullName: string; email: string; passwordHash: string; role: UserRole }
) {
  await pool.execute(
    "INSERT INTO users (id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
    [input.id, input.fullName, input.email, input.passwordHash, input.role]
  );

  return findUserById(pool, input.id);
}

export async function upsertUserApiKey(
  pool: Pool,
  input: {
    userId: string;
    provider: string;
    encryptedKey: string;
    iv: string;
    authTag: string;
    keyHint: string;
  }
) {
  await pool.execute(
    `INSERT INTO user_api_keys (user_id, provider, encrypted_key, iv, auth_tag, key_hint)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE encrypted_key = VALUES(encrypted_key), iv = VALUES(iv), auth_tag = VALUES(auth_tag), key_hint = VALUES(key_hint), updated_at = CURRENT_TIMESTAMP`,
    [input.userId, input.provider, input.encryptedKey, input.iv, input.authTag, input.keyHint]
  );
}

export async function getUserApiKey(pool: Pool, userId: string, provider: string) {
  const [rows] = await pool.query<ApiKeyRow[]>(
    `SELECT provider, encrypted_key, iv, auth_tag, key_hint, updated_at
     FROM user_api_keys
     WHERE user_id = ? AND provider = ?
     LIMIT 1`,
    [userId, provider]
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    provider: row.provider,
    encryptedKey: row.encrypted_key,
    iv: row.iv,
    authTag: row.auth_tag,
    keyHint: row.key_hint,
    updatedAt: toIsoDate(row.updated_at)
  } satisfies UserApiKeyRecord;
}

export async function listProjectsByUser(pool: Pool, userId: string) {
  const [rows] = await pool.query<ProjectRow[]>(
    `SELECT id, user_id, name, target_url, environment, status, seo_score, performance_score, created_at, updated_at
     FROM projects
     WHERE user_id = ?
     ORDER BY updated_at DESC, created_at DESC`,
    [userId]
  );

  return rows.map(mapProject);
}

export async function createProject(
  pool: Pool,
  input: {
    id: string;
    userId: string;
    name: string;
    targetUrl: string;
    environment: "production" | "staging" | "preview";
    status: string;
    seoScore: number;
    performanceScore: number;
  }
) {
  await pool.execute(
    `INSERT INTO projects (id, user_id, name, target_url, environment, status, seo_score, performance_score)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.id,
      input.userId,
      input.name,
      input.targetUrl,
      input.environment,
      input.status,
      input.seoScore,
      input.performanceScore
    ]
  );

  const [rows] = await pool.query<ProjectRow[]>(
    `SELECT id, user_id, name, target_url, environment, status, seo_score, performance_score, created_at, updated_at
     FROM projects
     WHERE id = ?
     LIMIT 1`,
    [input.id]
  );

  return rows[0] ? mapProject(rows[0]) : null;
}

export async function getActiveProject(pool: Pool, userId: string) {
  const [rows] = await pool.query<ProjectRow[]>(
    `SELECT id, user_id, name, target_url, environment, status, seo_score, performance_score, created_at, updated_at
     FROM projects
     WHERE user_id = ?
     ORDER BY updated_at DESC, created_at DESC
     LIMIT 1`,
    [userId]
  );

  return rows[0] ? mapProject(rows[0]) : null;
}

export async function createActivityLog(
  pool: Pool,
  input: {
    id: string;
    userId: string;
    type: string;
    title: string;
    status: string;
    metadataJson?: string | null;
  }
) {
  await pool.execute(
    "INSERT INTO activity_logs (id, user_id, type, title, status, metadata_json) VALUES (?, ?, ?, ?, ?, ?)",
    [input.id, input.userId, input.type, input.title, input.status, input.metadataJson ?? null]
  );
}

export async function listActivityLogsByUser(pool: Pool, userId: string) {
  const [rows] = await pool.query<ActivityRow[]>(
    `SELECT id, user_id, type, title, status, metadata_json, created_at
     FROM activity_logs
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 25`,
    [userId]
  );

  return rows.map(mapActivity);
}
