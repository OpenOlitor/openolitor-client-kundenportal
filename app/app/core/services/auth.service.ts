import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private configService = inject(ConfigService);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.restoreUser();
  }

  private restoreUser(): void {
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.userSubject.next(user),
        error: () => {
          this.clearToken();
          this.userSubject.next(this.getGuestUser());
        }
      });
    } else {
      this.userSubject.next(this.getGuestUser());
    }
  }

  private getGuestUser(): User {
    return {
      id: '',
      vorname: '',
      name: '',
      email: '',
      rolle: UserRole.Guest
    };
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string; user: User }>(
      `${this.configService.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(response => {
        this.setToken(response.token);
        this.userSubject.next(response.user);
      }),
      map(response => response.user)
    );
  }

  logout(): void {
    this.http.post(`${this.configService.apiUrl}/auth/logout`, {}).subscribe();
    this.clearToken();
    this.userSubject.next(this.getGuestUser());
    this.router.navigate(['/login']);
  }

  private getCurrentUser(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.configService.apiUrl}/auth/user`).pipe(
      map(response => response.user)
    );
  }

  isLoggedIn(): boolean {
    const user = this.userSubject.value;
    return user !== null && user.rolle !== UserRole.Guest;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  hasRole(roles: UserRole | UserRole[]): boolean {
    const user = this.userSubject.value;
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.rolle);
  }

  private getToken(): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1] || null;
  }

  private setToken(token: string): void {
    document.cookie = `XSRF-TOKEN=${token}; path=/; max-age=31536000; SameSite=Lax`;
  }

  private clearToken(): void {
    document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
