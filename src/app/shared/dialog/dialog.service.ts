import { Injectable } from '@angular/core';
import {DialogComponent} from "./dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    private dialog: MatDialog
  ) {}

  createLoadingDialog() {
    return this.dialog.open(DialogComponent, {data: {title: "Loading", isLoading: true}, disableClose: true});
  }
}
