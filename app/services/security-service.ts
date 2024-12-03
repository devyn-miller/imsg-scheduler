import { Biometrics } from '@nativescript/biometrics';
import { SecureStorage } from '@nativescript/secure-storage';

export class SecurityService {
  private static secureStorage = new SecureStorage();
  private static biometrics = new Biometrics();

  static async authenticate(): Promise<boolean> {
    try {
      const available = await this.biometrics.available();
      if (available) {
        const result = await this.biometrics.verifyFingerprint({
          title: 'Authenticate',
          message: 'Please authenticate to access messages'
        });
        return result.code === 0;
      }
      return true; // If biometrics not available, allow access
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  static async encryptAndStore(key: string, data: any): Promise<void> {
    try {
      const jsonString = JSON.stringify(data);
      await this.secureStorage.set({
        key,
        value: jsonString
      });
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  static async retrieveAndDecrypt(key: string): Promise<any> {
    try {
      const value = await this.secureStorage.get({
        key
      });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }
}