import { Injectable } from '@angular/core';

export interface AppConfig {
  ENV: string;
  version: string;
  API_URL: string;
  sendStats: boolean;
}

declare global {
  interface Window {
    getConfig?: () => AppConfig;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (typeof window !== 'undefined' && window.getConfig) {
      this.config = window.getConfig();
    } else {
      // Default configuration
      this.config = {
        ENV: 'development',
        version: '3.0.0',
        API_URL: 'http://localhost:9000/',
        sendStats: false
      };
    }
  }

  get apiUrl(): string {
    return this.config?.API_URL || 'http://localhost:9000/';
  }

  get environment(): string {
    return this.config?.ENV || 'development';
  }

  get version(): string {
    return this.config?.version || '3.0.0';
  }

  get sendStats(): boolean {
    return this.config?.sendStats || false;
  }

  getConfig(): AppConfig | null {
    return this.config;
  }
}
