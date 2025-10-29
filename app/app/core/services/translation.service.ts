import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translate = inject(TranslateService);
  private readonly LANG_COOKIE = 'activeLang';
  private readonly SUPPORTED_LANGS = [
    'de_CH', 'de_DE', 'de_DO', 'en_US', 
    'fr_CH', 'fr_BE', 'es_ES', 'cs_CZ', 'hu_HU'
  ];

  constructor() {
    this.translate.addLangs(this.SUPPORTED_LANGS);
    this.translate.setDefaultLang('en_US');
    this.initLanguage();
  }

  private initLanguage(): void {
    const storedLang = this.getStoredLanguage();
    if (storedLang) {
      this.changeLanguage(storedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.replace('-', '_');
      const detectedLang = this.detectLanguage(browserLang);
      this.changeLanguage(detectedLang);
    }
  }

  private detectLanguage(browserLang: string): string {
    const langMap: { [key: string]: string } = {
      'de_CH': 'de_CH',
      'de_DE': 'de_DE',
      'de': 'de_DE',
      'fr_CH': 'fr_CH',
      'fr_BE': 'fr_BE',
      'fr': 'fr_CH',
      'en': 'en_US',
      'es': 'es_ES',
      'cs': 'cs_CZ',
      'hu': 'hu_HU'
    };

    for (const [key, value] of Object.entries(langMap)) {
      if (browserLang.startsWith(key)) {
        return value;
      }
    }
    return 'en_US';
  }

  changeLanguage(lang: string): void {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      this.translate.use(lang);
      moment.locale(lang);
      this.storeLanguage(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en_US';
  }

  private getStoredLanguage(): string | null {
    const cookies = document.cookie.split('; ');
    const langCookie = cookies.find(c => c.startsWith(`${this.LANG_COOKIE}=`));
    return langCookie ? langCookie.split('=')[1] : null;
  }

  private storeLanguage(lang: string): void {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 3650);
    document.cookie = `${this.LANG_COOKIE}=${lang}; expires=${expireDate.toUTCString()}; path=/`;
  }
}
