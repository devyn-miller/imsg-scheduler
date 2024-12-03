import { ApplicationSettings } from '@nativescript/core';

export class AnalyticsService {
  private static readonly ANALYTICS_ENABLED_KEY = 'analytics_enabled';
  private static readonly USAGE_DATA_KEY = 'usage_data';

  static isEnabled(): boolean {
    return ApplicationSettings.getBoolean(this.ANALYTICS_ENABLED_KEY, false);
  }

  static setEnabled(enabled: boolean): void {
    ApplicationSettings.setBoolean(this.ANALYTICS_ENABLED_KEY, enabled);
  }

  static logEvent(category: string, action: string, label?: string): void {
    if (!this.isEnabled()) return;

    const usageData = this.getUsageData();
    usageData.push({
      timestamp: new Date().toISOString(),
      category,
      action,
      label
    });

    // Keep only last 100 events
    if (usageData.length > 100) {
      usageData.shift();
    }

    ApplicationSettings.setString(this.USAGE_DATA_KEY, JSON.stringify(usageData));
  }

  private static getUsageData(): any[] {
    const data = ApplicationSettings.getString(this.USAGE_DATA_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getAnalytics(): any {
    if (!this.isEnabled()) return null;

    const usageData = this.getUsageData();
    return {
      totalEvents: usageData.length,
      categorySummary: this.summarizeByCategory(usageData),
      recentEvents: usageData.slice(-10)
    };
  }

  private static summarizeByCategory(data: any[]): any {
    return data.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});
  }
}