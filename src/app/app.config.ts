import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 1. Registra o AuthInterceptor como um provedor de interceptador HTTP
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    },
    
    // 2. Configura o HttpClient para usar os interceptores fornecidos por Injeção de Dependência (DI)
    provideHttpClient(withInterceptorsFromDi())
  ]
};