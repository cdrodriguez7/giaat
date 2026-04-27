import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/hero-grid/hero-grid.component').then(m => m.HeroGridComponent),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./components/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'especialidad/:slug',
    loadComponent: () =>
      import('./components/specialty-detail/specialty-detail.component').then(m => m.SpecialtyDetailComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
