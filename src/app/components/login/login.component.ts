import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Tela de Login.
 *
 * Nota: o código deste componente não constava no material do curso (o guia referencia
 * LoginComponent em app.routes.ts no Módulo 06, mas o arquivo fonte nunca é apresentado
 * nos módulos seguintes). Foi escrito aqui seguindo o mesmo padrão visual (glass-panel,
 * navbar) e a mesma API do AuthService (login, currentUser, isAdmin) já definidos no
 * Módulo 07, para que a navegação da SPA funcione de ponta a ponta.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">🛒 TecLoja</a>
      <ul class="navbar-menu">
        <li><a class="navbar-link" routerLink="/">← Voltar ao Catálogo</a></li>
      </ul>
    </nav>

    <div style="max-width: 420px; margin: 4rem auto; padding: 0 1rem;">
      <div class="glass-panel">
        <h2 style="margin-bottom: 0.5rem;">Entrar na TecLoja</h2>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 2rem;">
          Use as credenciais didáticas criadas pelo DataSeeder.
        </p>

        <form [formGroup]="form" (ngSubmit)="entrar()">
          <div class="form-group">
            <label class="form-label">Usuário (e-mail)</label>
            <input type="email" class="form-control" formControlName="username"
                   placeholder="admin&#64;tecloja.com">
            <span *ngIf="isInvalid('username')" style="color: var(--danger-color); font-size: 0.8rem;">
              Informe um e-mail válido.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-control" formControlName="senha">
            <span *ngIf="isInvalid('senha')" style="color: var(--danger-color); font-size: 0.8rem;">
              A senha é obrigatória.
            </span>
          </div>

          <div *ngIf="errorMessage()" style="color: var(--danger-color); margin-bottom: 1rem; font-size: 0.875rem;">
            ⚠️ {{ errorMessage() }}
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;"
                  [disabled]="form.invalid || loading()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6;">
          <strong>Credenciais de teste (DataSeeder):</strong><br>
          Admin: admin&#64;tecloja.com / admin123<br>
          Cliente: usuario&#64;email.com / usuario123
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  entrar(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, senha } = this.form.value;

    this.auth.login(username, senha).subscribe({
      next: () => {
        this.loading.set(false);
        // ROLE_ADMIN vai direto para o painel de gestão; ROLE_USER vai para a vitrine
        this.router.navigate([this.auth.isAdmin() ? '/admin/produtos' : '/']);
      },
      error: (err) => {
        this.loading.set(false);
        // Trata a resposta de erro RFC 7807 (ProblemDetail) do Spring
        this.errorMessage.set(err.error?.detail ?? 'Usuário ou senha inválidos.');
      }
    });
  }
}
