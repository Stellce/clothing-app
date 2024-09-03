import { Routes } from '@angular/router';
import { loginGuard } from "./auth/auth.guard";

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

  {path: 'dashboard', loadComponent: () => import('./navigation/navbar/dashboard/dashboard.component').then(c => c.DashboardComponent)},
  {path: 'search', loadComponent: () => import('./navigation/navbar/search/search.component').then(c => c.SearchComponent)},
  {path: 'account', children: [
    {path: '', loadComponent: () => import('./navigation/navbar/account/account.component').then(c => c.AccountComponent), canActivate: [loginGuard]},
    {path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)},
    {path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent)},
  ]},
  {path: 'activate-account', loadComponent: () => import('./auth/activate/activate.component').then(c => c.ActivateComponent)},
  {path: 'favorites', loadComponent: () => import('./navigation/navbar/favorites/favorites.component').then(c => c.FavoritesComponent)},
  {path: 'cart', loadComponent: () => import('./navigation/navbar/cart/cart.component').then(c => c.CartComponent)},

  {path: 'orders', canActivate: [loginGuard], children: [
    {path: 'history', loadComponent: () => import('./navigation/navbar/account/order-history/order-history.component').then(c => c.OrderHistoryComponent)},
    {path: ':orderId', loadComponent: () => import('./order-page/order-page.component').then(c => c.OrderPageComponent)},
  ]},


  {path: 'products/:gender', children: [
    {path: '', loadComponent: () => import('./categories/categories.component').then(c => c.CategoriesComponent)},
    {path: ':categoryId', children: [
      {path: '', loadComponent: () => import('./categories/list-items/list-items.component').then(c => c.ListItemsComponent)},
      {path: ':itemId', loadComponent: () => import('./item/item.component').then(c => c.ItemComponent)},
    ]},
  ]},
  {path: 'product/:itemId', loadComponent: () => import('./item/item.component').then(c => c.ItemComponent)}
];
