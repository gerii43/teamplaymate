import CryptoJS from 'crypto-js';
import { SECURITY_CONFIG } from '../database/config';
import { Logger } from '../utils/logger';

export class EncryptionService {
  private logger = new Logger('EncryptionService');
  private secretKey: string;

  constructor() {
    this.secretKey = this.generateSecretKey();
  }

  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      this.logger.error('Encryption failed', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error);
      throw new Error('Failed to decrypt data');
    }
  }

  encryptObject(obj: any): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      this.logger.error('Object encryption failed', error);
      throw new Error('Failed to encrypt object');
    }
  }

  decryptObject<T>(encryptedData: string): T {
    try {
      const decrypted = this.decrypt(encryptedData);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      this.logger.error('Object decryption failed', error);
      throw new Error('Failed to decrypt object');
    }
  }

  generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128/8).toString();
  }

  hashPassword(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
  }

  verifyPassword(password: string, salt: string, hash: string): boolean {
    const computedHash = this.hashPassword(password, salt);
    return computedHash === hash;
  }

  private generateSecretKey(): string {
    // In production, this should be loaded from secure environment variables
    const stored = localStorage.getItem('encryption_key');
    if (stored) {
      return stored;
    }

    const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('encryption_key', newKey);
    return newKey;
  }

  rotateKey(): string {
    const newKey = CryptoJS.lib.WordArray.random(256/8).toString();
    const oldKey = this.secretKey;
    
    // In production, you would need to re-encrypt all data with the new key
    this.secretKey = newKey;
    localStorage.setItem('encryption_key', newKey);
    
    this.logger.info('Encryption key rotated');
    return oldKey; // Return old key for data migration
  }

  encryptSensitiveFields(data: any, sensitiveFields: string[]): any {
    const encrypted = { ...data };
    
    sensitiveFields.forEach(field => {
      if (encrypted[field]) {
        encrypted[field] = this.encrypt(String(encrypted[field]));
        encrypted[`${field}_encrypted`] = true;
      }
    });
    
    return encrypted;
  }

  decryptSensitiveFields(data: any, sensitiveFields: string[]): any {
    const decrypted = { ...data };
    
    sensitiveFields.forEach(field => {
      if (decrypted[field] && decrypted[`${field}_encrypted`]) {
        decrypted[field] = this.decrypt(decrypted[field]);
        delete decrypted[`${field}_encrypted`];
      }
    });
    
    return decrypted;
  }
}