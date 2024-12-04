import { Routes } from '@angular/router';
import { loginGuard } from "./auth/auth.guard";
import {employeeGuard} from "./employee/employee.guard";

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

  {path: 'dashboard', loadComponent: () => import('./tabs/landing/landing.component').then(c => c.LandingComponent)},
  {path: 'search', loadComponent: () => import('./tabs/search/search.component').then(c => c.SearchComponent)},
  {path: 'account', children: [
    {path: '', loadComponent: () => import('./tabs/account/account.component').then(c => c.AccountComponent), canActivate: [loginGuard]},
    {path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)},
    {path: 'register', loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent)},
  ]},
  {path: 'activate-account', loadComponent: () => import('./auth/activate/activate.component').then(c => c.ActivateComponent)},
  {path: 'recover-password', loadComponent: () => import('./auth/password-recovery/password-recovery.component').then(c => c.PasswordRecoveryComponent)},
  {path: 'favorites', loadComponent: () => import('./tabs/favorites/favorites.component').then(c => c.FavoritesComponent)},
  {path: 'cart', children: [
    {path: '', loadComponent: () => import('./tabs/cart/cart.component').then(c => c.CartComponent)},
    {path: ':itemId', loadComponent: () => import('./item/item.component').then(c => c.ItemComponent)},
  ]},

  {path: 'orders', canActivate: [loginGuard], children: [
    {path: 'history', loadComponent: () => import('./tabs/account/order-history/order-history.component').then(c => c.OrderHistoryComponent)},
    {path: ':orderId', loadComponent: () => import('./order-page/order-page.component').then(c => c.OrderPageComponent)},
  ]},

  {path: 'products/:gender', children: [
    {path: '', loadComponent: () => import('./categories/categories.component').then(c => c.CategoriesComponent)},
    {path: ':categoryId', children: [
      {path: '', loadComponent: () => import('./categories/list-items/list-items.component').then(c => c.ListItemsComponent)},
      {path: ':itemId', loadComponent: () => import('./item/item.component').then(c => c.ItemComponent)},
    ]},
  ]},
  {path: 'product/:itemId', loadComponent: () => import('./item/item.component').then(c => c.ItemComponent)},

  {path: 'employee-panel', canActivate: [employeeGuard], loadComponent: () => import('./employee/employee-panel/employee-panel.component').then(c => c.EmployeePanelComponent)},

  {path: '**', redirectTo: 'dashboard'},
];
