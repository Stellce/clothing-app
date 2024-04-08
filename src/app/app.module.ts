import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ListItemsComponent } from './list-items/list-items.component';
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
import { ItemComponent } from './list-items/item/item.component';
import { CategoriesComponent } from './categories/categories.component';
import { FilterComponent } from './list-items/filter/filter.component';
import { BreadcrumbComponent } from './list-items/breadcrumb/breadcrumb.component';
import { OutletComponent } from './outlet/outlet.component';
import { CheckboxComponent } from './list-items/filter/checkbox/checkbox.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import { PaginatorComponent } from './list-items/paginator/paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListItemsComponent,
    ItemComponent,
    CategoriesComponent,
    FilterComponent,
    BreadcrumbComponent,
    OutletComponent,
    CheckboxComponent,
    PaginatorComponent
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
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
