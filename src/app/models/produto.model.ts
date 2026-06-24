export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  ativo?: boolean;
  categoriaId: number;
  categoriaNome?: string;
}
