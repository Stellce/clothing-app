import { Injectable } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DialogData } from "../../../dialogs/dialog/dialog-data.model";
import { DialogComponent } from "../../../dialogs/dialog/dialog.component";

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
      inputs: [{name: 'promocode'}],
      buttonName: 'Submit'
    }
    const dialogRef = this.dialog.open(DialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((form: NgForm) => {
      if (form?.value) console.log('promo', form.value);
    });
  }
}
