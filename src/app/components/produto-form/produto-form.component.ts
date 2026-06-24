import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/">🛒 Formulário TecLoja</a>
    </nav>

    <div style="max-width: 600px; margin: 3rem auto; padding: 0 1rem;">
      <div class="glass-panel">
        <h2 style="margin-bottom: 2rem;">{{ id ? 'Editar Eletrônico' : 'Cadastrar Novo Eletrônico' }}</h2>

        <form [formGroup]="form" (ngSubmit)="salvar()">
          <div class="form-group">
            <label class="form-label">Nome do Eletrônico</label>
            <input type="text" class="form-control" formControlName="nome">
            <span *ngIf="isInvalid('nome')" style="color: var(--danger-color); font-size: 0.8rem;">O nome é obrigatório.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Descrição Técnica</label>
            <textarea class="form-control" rows="3" formControlName="descricao"></textarea>
          </div>

          <div style="display: flex; gap: 1rem;">
            <div class="form-group" style="flex: 1;">
              <label class="form-label">Preço (R$)</label>
              <input type="number" class="form-control" formControlName="preco">
              <span *ngIf="isInvalid('preco')" style="color: var(--danger-color); font-size: 0.8rem;">Deve ser maior que zero.</span>
            </div>

            <div class="form-group" style="flex: 1;">
              <label class="form-label">Estoque Físico</label>
              <input type="number" class="form-control" formControlName="estoque">
              <span *ngIf="isInvalid('estoque')" style="color: var(--danger-color); font-size: 0.8rem;">Não pode ser negativo.</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">ID da Categoria (1=Smartphones, 2=Notebooks, 3=Acessórios)</label>
            <input type="number" class="form-control" formControlName="categoriaId">
            <span *ngIf="isInvalid('categoriaId')" style="color: var(--danger-color); font-size: 0.8rem;">Escolha uma categoria válida.</span>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" class="btn btn-danger" routerLink="/admin/produtos">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProdutoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Parâmetro dinâmico de rota bindado automaticamente pelo Router do Angular 18+
  @Input() id?: string;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: [''],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [1, [Validators.required, Validators.min(1)]]
    });

    if (this.id) {
      this.carregarProdutoEdicao(Number(this.id));
    }
  }

  carregarProdutoEdicao(id: number): void {
    this.http.get<Produto>(`http://localhost:8080/api/v1/produtos/${id}`).subscribe(p => {
      this.form.patchValue(p);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  salvar(): void {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.id) {
      this.http.put(`http://localhost:8080/api/v1/produtos/${this.id}`, payload).subscribe({
        next: () => this.router.navigate(['/admin/produtos']),
        error: err => alert("Erro ao editar produto: " + err.error.message)
      });
    } else {
      this.http.post('http://localhost:8080/api/v1/produtos', payload).subscribe({
        next: () => this.router.navigate(['/admin/produtos']),
        error: err => alert("Erro ao cadastrar produto: " + err.error.message)
      });
    }
  }
}
