import { ItemPedido, ItemPedidoForm } from './item-pedido.model';

export interface PedidoForm {
  clienteId: number;
  itens: ItemPedidoForm[];
}

export interface Pedido {
  id: number;
  dataPedido: string;
  status: string;
  clienteId: number;
  clienteNome: string;
  itens: ItemPedido[];
  valorTotal: number;
}
