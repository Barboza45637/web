import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true; // Acesso Permitido
  }

  // Redireciona usuários não autorizados para a tela de login
  router.navigate(['/login']);
  return false;
};
