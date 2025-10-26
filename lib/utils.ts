import crypto from "crypto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encryptData(data: string): string {
  const salt = process.env.QR_SALT || "default-dev-salt-change-in-production";
  const algorithm = "aes-256-cbc";

  // Create a key from the salt
  const key = crypto.scryptSync(salt, "salt", 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV + encrypted data (we need IV for decryption)
  return iv.toString("hex") + ":" + encrypted;
}

export function decryptData(encryptedData: string): string {
  const salt = process.env.QR_SALT || "default-dev-salt-change-in-production";
  const algorithm = "aes-256-cbc";

  // Split IV and encrypted data
  const [ivHex, encrypted] = encryptedData.split(":");

  if (!ivHex || !encrypted) {
    throw new Error("Invalid encrypted data format");
  }

  // Create a key from the salt
  const key = crypto.scryptSync(salt, "salt", 32);
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
