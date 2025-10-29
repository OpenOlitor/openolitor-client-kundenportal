import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/user.model';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { AbosListComponent } from './features/abos/components/abos-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.Administrator, UserRole.Kunde] }
  },
  {
    path: 'abos',
    component: AbosListComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.Administrator, UserRole.Kunde] }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LoginComponent
  },
  {
    path: 'forbidden',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
