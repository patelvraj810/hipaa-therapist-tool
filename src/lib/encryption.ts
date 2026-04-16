import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-change-in-production';

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptPatientData(data: {
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceId?: string;
}): Record<string, string> {
  const encrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      encrypted[key] = encrypt(value);
    }
  }
  return encrypted;
}

export function decryptPatientData(encrypted: Record<string, string>): Record<string, string> {
  const decrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(encrypted)) {
    try {
      decrypted[key] = decrypt(value);
    } catch {
      decrypted[key] = value;
    }
  }
  return decrypted;
}