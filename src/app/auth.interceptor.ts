import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Injeta o AuthService para ter acesso ao estado de autenticação do usuário
  private authService = inject(AuthService);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Pega o usuário atual diretamente do signal no AuthService
    const currentUser = this.authService.currentUser();

    // 1. Verifica se há um usuário logado
    if (currentUser) {
      // 2. Clona a requisição original para adicionar o header de autorização
      // Em uma aplicação real, aqui iria um token JWT (ex: `Bearer ${currentUser.token}`)
      // Como não temos um token, vamos usar o username como um exemplo de autorização.
      const modifiedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.username}`
        }
      });
      
      // 3. Passa a requisição MODIFICADA para o próximo handler da cadeia
      return next.handle(modifiedReq);
    }

    // Se não houver usuário, a requisição original segue sem modificação
    return next.handle(request);
  }
}