import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListItemsComponent} from "./categories/list-items/list-items.component";
import {CategoriesComponent} from "./categories/categories.component";
import {DashboardComponent} from "./navigation/bottom-navbar/dashboard/dashboard.component";
import {SearchComponent} from "./navigation/bottom-navbar/search/search.component";
import {AccountComponent} from "./navigation/bottom-navbar/account/account.component";
import {FavoritesComponent} from "./navigation/bottom-navbar/favorites/favorites.component";
import {CartComponent} from "./navigation/bottom-navbar/cart/cart.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {loginGuard} from "./auth/auth.guard";
import {OrderHistoryComponent} from "./navigation/bottom-navbar/account/order-history/order-history.component";
import {ItemComponent} from "./item/item.component";
import {OrderPageComponent} from "./order-page/order-page.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

  {path: 'dashboard', component: DashboardComponent},
  {path: 'search', component: SearchComponent},
  {path: 'account', children: [
    {path: '', component: AccountComponent, canActivate: [loginGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
  ]},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'cart', component: CartComponent},

  {path: 'orders', canActivate: [loginGuard], children: [
    {path: 'history', component: OrderHistoryComponent},
    {path: ':orderId', component: OrderPageComponent},
  ]},


  {path: 'products/:gender', children: [
    {path: '', component: CategoriesComponent},
    {path: ':categoryId', children: [
      {path: '', component: ListItemsComponent},
      {path: ':itemId', component: ItemComponent},
    ]},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
