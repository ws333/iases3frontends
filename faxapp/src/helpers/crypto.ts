import { msg } from '../constants/constMessages';
import { OPTIONS_KEY, deleteOptionsKey, getOptionApiKey, getOptionApiKeySalt, storeOptionsKey } from './indexedDB';

// Encrypt a string using AES-GCM
export async function encryptString(plainText: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data,
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Return as base64 string
  return btoa(String.fromCharCode(...combined));
}

// Decrypt a string using AES-GCM
export async function decryptString(encryptedText: string, key: CryptoKey): Promise<string> {
  const combined = new Uint8Array(
    atob(encryptedText)
      .split('')
      .map((char) => char.charCodeAt(0)),
  );

  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encrypted,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Derive a key from a fixed passphrase using PBKDF2
export async function deriveKeyFromPassphrase(passphrase: string, salt: BufferSource): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false, // Not extractable
    ['encrypt', 'decrypt'],
  );
}

// Generate a random salt for PBKDF2
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
}

export interface StoreApiKeyArgs {
  apiKey: string;
  passphrase: string;
  overwrite?: boolean;
}

// Store encrypted API key
export async function storeApiKey({ apiKey, passphrase, overwrite }: StoreApiKeyArgs): Promise<string> {
  if (!apiKey) return msg.missingApiKey;
  if (!passphrase) return msg.missingPassphrase;

  // Dont overwrite an existing key unless specified
  if (!overwrite) {
    const decryptedKey = await getApiKey(passphrase);
    if (!decryptedKey) return msg.incorrectPassphrase;
  }

  const salt = generateSalt();
  const key = await deriveKeyFromPassphrase(passphrase, salt);
  const encryptedKey = await encryptString(apiKey, key);

  // Store encrypted key and salt
  await storeOptionsKey(encryptedKey, OPTIONS_KEY.API_KEY);
  await storeOptionsKey(btoa(String.fromCharCode(...salt)), OPTIONS_KEY.API_KEY_SALT);
  return msg.apiKeyStored;
}

/**
 * - Overwrite with empty strings
 */
export async function deleteApiKey(): Promise<string> {
  try {
    await deleteOptionsKey(OPTIONS_KEY.API_KEY);
    await deleteOptionsKey(OPTIONS_KEY.API_KEY_SALT);
    return '';
  } catch (error) {
    return `${msg.errorDeletingApiKey} ${(error as Error).message}`;
  }
}

/**
 * Retrieve and decrypt API key
 * - Returns an empty string if the passphrase is not valid
 */
export async function getApiKey(passPhrase: string): Promise<string> {
  try {
    const encryptedKey = await getOptionApiKey();
    if (!encryptedKey) return '';

    const saltBase64 = await getOptionApiKeySalt();
    if (!encryptedKey || !saltBase64) return '';

    const salt = new Uint8Array(
      atob(saltBase64)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );
    const key = await deriveKeyFromPassphrase(passPhrase, salt);
    return await decryptString(encryptedKey, key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return '';
  }
}

export async function checkApiKeyExists() {
  const encryptedKey = await getOptionApiKey();
  if (encryptedKey) return true;

  return false;
}
