import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">🛒 TecLoja</a>
      <ul class="navbar-menu">
        <li><a class="navbar-link" routerLink="/">← Continuar Comprando</a></li>
      </ul>
    </nav>

    <div style="max-width: 900px; margin: 3rem auto; padding: 0 1rem;">
      <h2 style="margin-bottom: 2rem;">Seu Carrinho</h2>

      <ng-container *ngIf="carrinho.itens().length > 0; else carrinhoVazio">
        <!-- Lista de Itens -->
        <div class="glass-panel" *ngFor="let item of carrinho.itens()"
             style="display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 1rem; padding: 1.25rem 1.5rem;">
          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">{{ item.nome }}</h3>
            <span style="color: var(--text-secondary); font-size: 0.85rem;">
              {{ item.preco | currency:'BRL' }} × {{ item.quantidade }}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <span style="font-weight: 700; font-size: 1.2rem; color: var(--accent-color);">
              {{ (item.preco * item.quantidade) | currency:'BRL' }}
            </span>
            <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;"
                    (click)="carrinho.remover(item.produtoId)">Remover</button>
          </div>
        </div>

        <!-- Resumo e Checkout -->
        <div class="glass-panel" style="margin-top: 2rem; text-align: right;">
          <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">
            Total: <strong style="font-size: 1.5rem; color: var(--accent-color);">
              {{ carrinho.valorTotal() | currency:'BRL' }}
            </strong>
          </p>

          <div *ngIf="errorMessage()" style="color: var(--danger-color); margin-bottom: 1rem; text-align: left;">
            ⚠️ {{ errorMessage() }}
          </div>

          <button class="btn btn-primary" (click)="finalizarCompra()" [disabled]="loading()">
            {{ loading() ? 'Faturando...' : 'Finalizar Compra' }}
          </button>
        </div>
      </ng-container>

      <ng-template #carrinhoVazio>
        <div class="glass-panel" style="text-align: center; padding: 4rem;">
          <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            Seu carrinho está vazio.
          </p>
          <a class="btn btn-primary" routerLink="/">Ver Catálogo</a>
        </div>
      </ng-template>
    </div>
  `
})
export class CarrinhoComponent {
  carrinho = inject(CarrinhoService);
  auth     = inject(AuthService);
  router = inject(Router);

  loading      = signal(false);
  errorMessage = signal<string | null>(null);

  finalizarCompra(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.carrinho.finalizarPedido().subscribe({
      next: () => {
        this.loading.set(false);
        alert('🎉 Pedido faturado com sucesso! Estoque atualizado.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        // Trata a resposta de erro RFC 7807 (ProblemDetail) do Spring
        this.errorMessage.set(err.error?.detail ?? 'Erro ao finalizar compra. Tente novamente.');
      }
    });
  }
}
