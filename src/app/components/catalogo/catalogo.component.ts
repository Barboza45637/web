import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../../models/produto.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">🛒 TecLoja</a>
      <ul class="navbar-menu">
        <li><a class="navbar-link active" routerLink="/">Catálogo</a></li>
        <li><a class="navbar-link" routerLink="/carrinho">Carrinho ({{ carrinho.totalItens() }})</a></li>

        <li *ngIf="auth.isAdmin()"><a class="navbar-link" routerLink="/admin/produtos">Painel Admin</a></li>

        <li *ngIf="!auth.isAuthenticated()"><a class="btn btn-primary" routerLink="/login">Login</a></li>
        <li *ngIf="auth.isAuthenticated()">
          <span style="margin-right: 10px; color: var(--text-secondary);">Olá, {{ auth.currentUser()?.username }}</span>
          <button class="btn btn-danger" (click)="auth.logout()">Sair</button>
        </li>
      </ul>
    </nav>

    <div style="padding: 2rem 5%;">
      <!-- Filtros de Pesquisa -->
      <div class="glass-panel" style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <input type="text" class="form-control" style="flex: 2; min-width: 250px;"
               placeholder="Busque eletrônicos..." [(ngModel)]="busca" (input)="pesquisar()">
      </div>

      <!-- Grid de Produtos Responsivo em Glassmorphism -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
        <div class="glass-panel product-card" *ngFor="let p of produtos()">
          <div style="height: 150px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <span style="font-size: 3rem;">💻</span>
          </div>
          <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">{{ p.nome }}</h3>
          <p style="color: var(--text-secondary); font-size: 0.875rem; min-height: 40px; margin-bottom: 1rem;">{{ p.descricao }}</p>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">{{ p.preco | currency:'BRL' }}</span>
            <span [style.color]="p.estoque > 0 ? 'var(--success-color)' : 'var(--danger-color)'" style="font-size: 0.875rem; font-weight: 600;">
              {{ p.estoque > 0 ? p.estoque + ' em estoque' : 'Esgotado' }}
            </span>
          </div>

          <button class="btn btn-primary" style="width: 100%; justify-content: center;"
                  [disabled]="p.estoque <= 0" (click)="adicionarAoCarrinho(p)">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  `
})
export class CatalogoComponent implements OnInit {
  private http = inject(HttpClient);
  carrinho = inject(CarrinhoService);
  auth = inject(AuthService);

  produtos = signal<Produto[]>([]);
  busca = '';

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.http.get<Produto[]>('http://localhost:8080/api/v1/produtos').subscribe({
      next: data => this.produtos.set(data),
      error: err => console.error("Erro ao obter catálogo", err)
    });
  }

  pesquisar(): void {
    if (!this.busca.trim()) {
      this.carregarProdutos();
      return;
    }

    this.http.get<Produto[]>(`http://localhost:8080/api/v1/produtos/pesquisa?nome=${this.busca}`).subscribe({
      next: data => this.produtos.set(data)
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinho.adicionar(produto);
  }
}
