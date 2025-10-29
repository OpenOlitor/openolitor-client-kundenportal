import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        alertService.removeAllAlerts();
        router.navigate(['/logout']);
      }
      return throwError(() => error);
    })
  );
};
