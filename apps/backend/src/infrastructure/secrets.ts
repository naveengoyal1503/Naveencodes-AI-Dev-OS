import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export interface EncryptedSecretRecord {
  encryptedKey: string;
  iv: string;
  authTag: string;
  keyHint: string;
}

function createKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string, secret: string): EncryptedSecretRecord {
  const key = createKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedKey: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    keyHint: value.length <= 4 ? value : `...${value.slice(-4)}`
  };
}

export function decryptSecret(
  input: Pick<EncryptedSecretRecord, "encryptedKey" | "iv" | "authTag">,
  secret: string
) {
  const key = createKey(secret);
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(input.iv, "base64"));
  decipher.setAuthTag(Buffer.from(input.authTag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(input.encryptedKey, "base64")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}
