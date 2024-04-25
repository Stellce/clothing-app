import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListItemsComponent} from "./categories/list-items/list-items.component";
import {CategoriesComponent} from "./categories/categories.component";
import {DashboardComponent} from "./navigation/bottom-navbar/dashboard/dashboard.component";
import {SearchComponent} from "./navigation/bottom-navbar/search/search.component";
import {AccountComponent} from "./navigation/bottom-navbar/account/account.component";
import {FavoritesComponent} from "./navigation/bottom-navbar/favorites/favorites.component";
import {CartComponent} from "./navigation/bottom-navbar/cart/cart.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'search', component: SearchComponent},
  {path: 'account', component: AccountComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'cart', component: CartComponent},

  {path: 'products/:gender', component: CategoriesComponent},
  {path: 'products/:gender/:categoryId', component: ListItemsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
