import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Rotas Públicas da Loja
  {
    path: '',
    loadComponent: () => import('./components/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./components/carrinho/carrinho.component').then(m => m.CarrinhoComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },

  // Rotas Administrativas Privadas (Protegidas por Guarda de Rota)
  {
    path: 'admin/produtos',
    loadComponent: () => import('./components/admin-produtos/admin-produtos.component').then(m => m.AdminProdutosComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/produtos/novo',
    loadComponent: () => import('./components/produto-form/produto-form.component').then(m => m.ProdutoFormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/produtos/editar/:id',
    loadComponent: () => import('./components/produto-form/produto-form.component').then(m => m.ProdutoFormComponent),
    canActivate: [adminGuard]
  },

  // Rota Curinga para redirecionar endereços inválidos
  {
    path: '**',
    redirectTo: ''
  }
];
