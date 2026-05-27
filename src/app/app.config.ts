import { ApplicationConfig }                                      from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideAnimations }                                      from '@angular/platform-browser/animations';
import { routes }                                                 from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        anchorScrolling:        'enabled',   // Activa navegación a #anclas
        scrollPositionRestoration: 'top',    // Vuelve al top al navegar entre rutas
      }),
    ),
    provideAnimations(),
  ],
};
