import { Component } from '@angular/core';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {OutletComponent} from "../navigation/navbar/dashboard/outlet/outlet.component";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {AdminService} from "./admin.service";
import {DialogData} from "../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    OutletComponent,
    MatDivider,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  addIds: string[];
  deleteIds: string[];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  addItems() {
    const ids = this.addIds.join(',');
    this.adminService.addToLandingPage(ids).subscribe({
      next: () => {
        const dialogData: DialogData = {
          title: 'Items added',
          description: 'Items were successfully added to landing page',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      },
      error: () => {
        const dialogData: DialogData = {
          title: 'Error',
          description: 'Something went wrong. Could not add items',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      }
    });
  }

  deleteItems() {
    const ids = this.deleteIds.join(',');
    this.adminService.deleteFromLandingPage(ids).subscribe({
      next: () => {
        const dialogData: DialogData = {
          title: 'Items added',
          description: 'Items were successfully deleted to landing page',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      },
      error: () => {
        const dialogData: DialogData = {
          title: 'Error',
          description: 'Something went wrong. Could not delete items',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      }
    });
  }
}
