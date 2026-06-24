export interface ItemPedidoForm {
  produtoId: number;
  quantidade: number;
}

export interface ItemPedido {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}
