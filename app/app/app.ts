import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { AuthService } from './core/services/auth.service';
import { ProjektService } from './core/services/projekt.service';
import { TranslationService } from './core/services/translation.service';
import { AlertService, Alert } from './core/services/alert.service';
import { ConfigService } from './core/services/config.service';
import { User } from './core/models/user.model';
import { Projekt } from './core/models/projekt.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private projektService = inject(ProjektService);
  private translationService = inject(TranslationService);
  private alertService = inject(AlertService);
  private configService = inject(ConfigService);
  private router = inject(Router);
  
  title = 'OpenOlitor Kundenportal';
  user: User | null = null;
  projekt: Projekt | null = null;
  alerts: Alert[] = [];
  connected = true;
  loaded = false;
  version = '';
  env = '';
  buildNr = '@@BUILD_NR';
  
  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user && user.rolle !== 'Guest') {
        this.projektService.loadProjekt().subscribe({
          next: () => this.loaded = true,
          error: () => this.loaded = true
        });
      } else {
        this.projektService.loadProjekt(true).subscribe({
          next: () => this.loaded = true,
          error: () => this.loaded = true
        });
      }
    });
    
    // Subscribe to projekt changes
    this.projektService.projekt$.subscribe(projekt => {
      this.projekt = projekt;
    });
    
    // Subscribe to alerts
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
    
    // Load config
    this.version = this.configService.version;
    this.env = this.configService.environment;
    
    // Scroll to top on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  changeLanguage(lang: string): void {
    this.translationService.changeLanguage(lang);
  }
  
  getCurrentLanguage(): string {
    return this.translationService.getCurrentLanguage();
  }
  
  removeAlert(id: string): void {
    this.alertService.removeAlert(id);
  }
}
