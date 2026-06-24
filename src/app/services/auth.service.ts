import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  // Signal Reativo contendo o usuário logado e seu papel administrativo
  currentUser = signal<LoginResponse | null>(this.getStoredUser());

  login(username: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, senha }).pipe(
      tap(response => {
        // Gravar no localStorage para persistência entre atualizações de tela
        localStorage.setItem('tecloja_user', JSON.stringify(response));
        // Atualiza o valor do Signal reativamente
        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('tecloja_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? user.token : null;
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user ? user.role === 'ROLE_ADMIN' : false;
  }

  private getStoredUser(): LoginResponse | null {
    const userJson = localStorage.getItem('tecloja_user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as LoginResponse;
      } catch {
        return null;
      }
    }
    return null;
  }
}
