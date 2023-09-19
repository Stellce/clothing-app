import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListItemsComponent} from "./list-items/list-items.component";
import {CategoriesComponent} from "./categories/categories.component";

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: 'children/:gender/', component: CategoriesComponent},
  {path: 'children/:gender/:category', component: ListItemsComponent},
  {path: ':gender', component: CategoriesComponent},
  {path: ':gender/:category', component: ListItemsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
