import { SecureStorage } from '@nativescript/secure-storage';
import { Biometrics } from '@nativescript/biometrics';
import { ApplicationSettings } from '@nativescript/core';

export class AuthService {
  private static readonly PIN_KEY = 'user_pin';
  private static readonly secureStorage = new SecureStorage();
  private static readonly biometrics = new Biometrics();

  static async authenticate(): Promise<boolean> {
    try {
      const biometricsAvailable = await this.biometrics.available();
      
      if (biometricsAvailable) {
        const result = await this.biometrics.verifyFingerprint({
          title: 'Authenticate',
          message: 'Please authenticate to access messages',
          fallbackMessage: 'Use PIN instead'
        });
        return result.code === 0;
      }
      
      // Fallback to PIN authentication
      return this.authenticateWithPin();
    } catch (error) {
      console.error('Authentication error:', error);
      return this.authenticateWithPin();
    }
  }

  private static async authenticateWithPin(): Promise<boolean> {
    const storedPin = await this.secureStorage.get({ key: this.PIN_KEY });
    if (!storedPin) {
      // First time setup - create PIN
      return this.setupPin();
    }
    
    // Implement PIN verification dialog
    // Return true if PIN matches, false otherwise
    return true; // Placeholder
  }

  private static async setupPin(): Promise<boolean> {
    // Implement PIN setup dialog
    const newPin = '1234'; // Placeholder - implement actual PIN input
    await this.secureStorage.set({
      key: this.PIN_KEY,
      value: newPin
    });
    return true;
  }
}