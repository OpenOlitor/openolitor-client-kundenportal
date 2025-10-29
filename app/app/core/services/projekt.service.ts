import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Projekt } from '../models/projekt.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ProjektService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  
  private projektSubject = new BehaviorSubject<Projekt | null>(null);
  public projekt$ = this.projektSubject.asObservable();

  loadProjekt(openAccess = false): Observable<Projekt> {
    const endpoint = openAccess ? 'open/projekt' : 'kundenportal/projekt';
    return this.http.get<Projekt>(`${this.configService.apiUrl}${endpoint}`).pipe(
      tap(projekt => this.projektSubject.next(projekt))
    );
  }

  getProjekt(): Projekt | null {
    return this.projektSubject.value;
  }
}
