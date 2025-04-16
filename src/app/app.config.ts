import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import Aura from '@primeng/themes/aura'
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    providePrimeNG({ theme: { preset: Aura } })
  ]
};