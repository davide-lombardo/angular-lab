import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'forms-lab',
    loadComponent: () => import('./features/forms-lab/forms-lab.component').then(m => m.FormsLabComponent),
  },
  {
    path: 'signals-lab',
    loadComponent: () => import('./features/signals-lab/signals-lab.component').then(m => m.SignalsLabComponent),
  },
  {
    path: 'grids-lab',
    loadComponent: () => import('./features/grid-lab/grid-lab.component').then(m => m.GridLabComponent),
  },
  {
    path: 'primeng-lab',
    loadComponent: () => import('./features/primeng-lab/primeng-lab.component').then(m => m.PrimeNgLabComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'forms-lab',
  }
];
