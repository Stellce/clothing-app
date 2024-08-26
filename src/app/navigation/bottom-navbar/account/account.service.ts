import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../dialogs/dialog/dialog.component";
import {DialogData} from "../../../dialogs/dialog/dialog-data.model";
import {NgForm} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public dialog: MatDialog) { }

  enterPromocode() {
    const dialogData: DialogData = {
      title: 'Promo-code',
      description: '',
      note: '',
      inputs: ['promocode'],
      buttonName: 'Submit'
    }
    const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((form: NgForm) => {
      if (form?.value) console.log('promo', form.value);
    });
  }
}
