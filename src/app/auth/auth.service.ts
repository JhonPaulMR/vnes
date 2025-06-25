import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

// Interface de usuário atualizada: 'name' foi removido e 'username' será usado como o nome de exibição.
interface User {
  username: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  currentUser = signal<User | null>(null);

  private readonly usersStorageKey = 'vnes_users';
  private readonly currentUserStorageKey = 'vnes_currentUser';

  constructor() {
    const storedUser = localStorage.getItem(this.currentUserStorageKey);
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  /**
   * Regista um novo usuário.
   * @param user Dados do usuário (username, email, password).
   * @returns Verdadeiro se o registo for bem-sucedido.
   */
  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersStorageKey) || '[]');

    if (users.some(u => u.username === user.username)) {
      alert('Este nome de utilizador já existe!');
      return false;
    }
    if (users.some(u => u.email === user.email)) {
      alert('Este e-mail já está em uso!');
      return false;
    }
    
    // ATENÇÃO: btoa não é criptografia. Use hashing num backend real.
    const userToStore = { ...user, password: btoa(user.password!) };

    users.push(userToStore);
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
    alert('Registo bem-sucedido! Por favor, faça o login.');
    return true;
  }

  /**
   * Efetua o login do usuário.
   * @param credentials Credenciais de login (email e password).
   * @returns Verdadeiro se o login for bem-sucedido.
   */
  login(credentials: any): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersStorageKey) || '[]');
    
    const foundUser = users.find(
      u => u.email === credentials.email && u.password === btoa(credentials.password)
    );

    if (foundUser) {
      const userForSession: User = { ...foundUser };
      delete userForSession.password;

      localStorage.setItem(this.currentUserStorageKey, JSON.stringify(userForSession));
      this.currentUser.set(userForSession);
      
      this.router.navigate(['/']);
      return true;
    } else {
      alert('E-mail ou password inválidos.');
      return false;
    }
  }

  /**
   * Efetua o logout do usuário.
   */
  logout() {
    localStorage.removeItem(this.currentUserStorageKey);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
