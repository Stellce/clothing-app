import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogData} from "../../shared/dialog/dialog-data.model";
import {DialogComponent} from "../../shared/dialog/dialog.component";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  promocode: string = '';
  constructor(public dialog: MatDialog) { }

  enterPromocode() {
    const dialogData: DialogData = {
      title: 'Promo-code',
      description: '',
      note: '',
      inputs: [{name: 'promocode'}],
      buttonName: 'Submit'
    }
    this.dialog.open(DialogComponent, {data: dialogData}).afterClosed()
      .subscribe(result => this.promocode = result);
  }
}
