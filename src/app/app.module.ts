import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { ListItemsComponent } from './categories/list-items/list-items.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {NgOptimizedImage} from "@angular/common";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatChipsModule} from "@angular/material/chips";
import {HttpClientModule} from "@angular/common/http";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatPaginatorModule} from "@angular/material/paginator";
import { ItemCardComponent } from './categories/list-items/item-card/item-card.component';
import { CategoriesComponent } from './categories/categories.component';
import { FilterComponent } from './categories/list-items/filter/filter.component';
import { BreadcrumbComponent } from './categories/list-items/breadcrumb/breadcrumb.component';
import { OutletComponent } from './outlet/outlet.component';
import { CheckboxComponent } from './categories/list-items/filter/checkbox/checkbox.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import { PaginatorComponent } from './categories/list-items/paginator/paginator.component';
import {MatRippleModule} from "@angular/material/core";
import { BottomNavbarComponent } from './navigation/bottom-navbar/bottom-navbar.component';
import { ItemComponent } from './item/item.component';
import { DashboardComponent } from './navigation/bottom-navbar/dashboard/dashboard.component';
import { SearchComponent } from './navigation/bottom-navbar/search/search.component';
import { AccountComponent } from './navigation/bottom-navbar/account/account.component';
import { FavoritesComponent } from './navigation/bottom-navbar/favorites/favorites.component';
import { CartComponent } from './navigation/bottom-navbar/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListItemsComponent,
    ItemCardComponent,
    CategoriesComponent,
    FilterComponent,
    BreadcrumbComponent,
    OutletComponent,
    CheckboxComponent,
    PaginatorComponent,
    BottomNavbarComponent,
    ItemComponent,
    DashboardComponent,
    SearchComponent,
    AccountComponent,
    FavoritesComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    NgOptimizedImage,
    MatSliderModule,
    MatInputModule,
    FormsModule,
    MatChipsModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
