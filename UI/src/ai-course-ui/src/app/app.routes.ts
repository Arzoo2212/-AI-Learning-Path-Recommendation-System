import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) },
  {
    path: '',
    loadComponent: () => import('./shared/layout/shell/shell').then(m => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'skill-gap', loadComponent: () => import('./features/skill-gap/skill-gap').then(m => m.SkillGap) },
      { path: 'learning-paths', loadComponent: () => import('./features/learning-paths/learning-paths').then(m => m.LearningPaths) },
      { path: 'courses', loadComponent: () => import('./features/courses/courses').then(m => m.Courses) },
      { path: 'progress', loadComponent: () => import('./features/progress/progress').then(m => m.ProgressPage) },
      { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.Profile) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
