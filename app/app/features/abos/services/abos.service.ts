import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Abo } from '../models/abo.model';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class AbosService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  getAbos(): Observable<Abo[]> {
    return this.http.get<Abo[]>(`${this.configService.apiUrl}kundenportal/abos`);
  }

  getAbo(id: number): Observable<Abo> {
    return this.http.get<Abo>(`${this.configService.apiUrl}kundenportal/abos/${id}`);
  }
}
