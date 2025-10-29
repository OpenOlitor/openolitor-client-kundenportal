import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const allowedRoles = route.data['roles'] as UserRole[] | undefined;
  
  // If no roles specified, allow Guest access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  
  // Check if user has required role
  if (authService.hasRole(allowedRoles)) {
    return true;
  }
  
  // Redirect based on login status
  if (authService.isLoggedIn()) {
    router.navigate(['/forbidden']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
