import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MenComponent} from "./men/men.component";

const routes: Routes = [
  {path: 'men', component: MenComponent},
  {path: '', redirectTo: 'men', pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
