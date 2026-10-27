import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./wizard').then(m => m.Wizard) },
  { path: 'editor', loadComponent: () => import('./editor').then(m => m.Editor) },
  { path: '**', redirectTo: '' }
];
