import { Injectable } from '@angular/core';
import {DialogComponent} from "./dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  loadingDialogs: MatDialogRef<DialogComponent>[] = [];

  constructor(
    private dialog: MatDialog
  ) {}

  createLoadingDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {data: {title: "Loading", isLoading: true}, disableClose: true});
    this.loadingDialogs.push(dialogRef);
    return dialogRef;
  }
}
