import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Otimização de detecção de mudanças por zonas
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Roteamento global (com amarração automática de parâmetros de URL para Inputs)
    provideRouter(routes, withComponentInputBinding()),

    // Injeção do HttpClient de requisições com o interceptor de segurança anexado
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
