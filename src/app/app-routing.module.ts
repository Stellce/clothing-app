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
import {OutletComponent} from "./outlet/outlet.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, children: [
      {path: '', component: OutletComponent}
  ]},
  {path: 'search', component: SearchComponent},
  {path: 'account', component: AccountComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'cart', component: CartComponent},

  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'products/:gender', component: CategoriesComponent},
  {path: 'products/:gender/:categoryId', component: ListItemsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
