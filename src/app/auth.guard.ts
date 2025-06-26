import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

/**
 * Um guard que verifica se um usuário está autenticado.
 * Se o usuário estiver logado, permite o acesso à rota.
 * Caso contrário, redireciona para a página de login/registo.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // O currentUser() retorna os dados do usuário ou null.
  // A presença de um usuário indica que ele está logado.
  if (authService.currentUser()) {
    return true; // Utilizador logado, acesso permitido.
  } else {
    // Utilizador não logado, redireciona para a página de autenticação.
    return router.parseUrl('/auth');
  }
};