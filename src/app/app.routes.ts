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
    path: 'performance-lab',
    loadComponent: () => import('./features/performance-lab/performance-lab.component').then(m => m.PerformanceLabComponent),
  },
  {
    path: 'rxjs-lab',
    loadComponent: () => import('./features/rxjs-lab/rxjs-lab.component').then(m => m.RxjsLabComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'forms-lab',
  }
];
