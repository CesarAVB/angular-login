import { LoginComponent } from './pages/login/login';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
