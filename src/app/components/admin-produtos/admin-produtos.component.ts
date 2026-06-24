import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">🛒 TecLoja Admin</a>
      <button class="btn btn-danger" routerLink="/">Sair do Painel</button>
    </nav>

    <div style="padding: 2rem 5%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>Gestão de Produtos do Catálogo</h2>
        <button class="btn btn-primary" routerLink="/admin/produtos/novo">+ Cadastrar Novo Eletrônico</button>
      </div>

      <div class="glass-panel" style="overflow-x: auto; padding: 0;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.1);">
              <th style="padding: 1rem;">ID</th>
              <th style="padding: 1rem;">Nome</th>
              <th style="padding: 1rem;">Estoque</th>
              <th style="padding: 1rem;">Preço</th>
              <th style="padding: 1rem; text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of produtos()" style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;">
              <td style="padding: 1rem;">{{ p.id }}</td>
              <td style="padding: 1rem; font-weight: 600;">{{ p.nome }}</td>
              <td style="padding: 1rem;">{{ p.estoque }} unid.</td>
              <td style="padding: 1rem; color: var(--accent-color); font-weight: 700;">{{ p.preco | currency:'BRL' }}</td>
              <td style="padding: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
                <button class="btn btn-primary" style="padding: 0.5rem 1rem;" [routerLink]="['/admin/produtos/editar', p.id]">Editar</button>
                <button class="btn btn-danger" style="padding: 0.5rem 1rem;" (click)="deletar(p.id!)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminProdutosComponent implements OnInit {
  private http = inject(HttpClient);
  produtos = signal<Produto[]>([]);

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.http.get<Produto[]>('http://localhost:8080/api/v1/produtos').subscribe(data => this.produtos.set(data));
  }

  deletar(id: number): void {
    if (confirm("Deseja realmente excluir este produto da TecLoja?")) {
      this.http.delete(`http://localhost:8080/api/v1/produtos/${id}`).subscribe(() => {
        this.produtos.update(current => current.filter(p => p.id !== id));
      });
    }
  }
}
