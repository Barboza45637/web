import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../models/produto.model';
import { ItemPedidoForm } from '../models/item-pedido.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

export interface CartItem {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8080/api/v1/pedidos';

  // Signal Writable com a lista de itens
  itens = signal<CartItem[]>([]);

  // Signals Computados para recalcular totais de forma super-eficiente
  totalItens = computed(() => this.itens().reduce((acc, item) => acc + item.quantidade, 0));

  valorTotal = computed(() => this.itens().reduce((acc, item) => acc + (item.preco * item.quantidade), 0));

  adicionar(produto: Produto): void {
    if (!produto.id) return;

    this.itens.update(currentItens => {
      const itemExistente = currentItens.find(item => item.produtoId === produto.id);

      if (itemExistente) {
        return currentItens.map(item =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...currentItens, { produtoId: produto.id!, nome: produto.nome, preco: produto.preco, quantidade: 1 }];
    });
  }

  remover(produtoId: number): void {
    this.itens.update(currentItens => currentItens.filter(item => item.produtoId !== produtoId));
  }

  limpar(): void {
    this.itens.set([]);
  }

  // Realiza o checkout integrando diretamente ao backend
  finalizarPedido() {
    const user = this.authService.currentUser();
    if (!user) throw new Error("Usuário não autenticado");

    // Constrói o DTO de formulário de pedido esperado pelo backend
    const pedidoForm = {
      clienteId: 1, // Fixado id didático do cliente usuario@email.com criado pelo Seeder
      itens: this.itens().map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    };

    return this.http.post(this.apiUrl, pedidoForm).pipe(
      tap(() => this.limpar()) // Limpa o carrinho após sucesso no checkout
    );
  }
}
