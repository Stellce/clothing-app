import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData} from "./dialog-data.model";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  passwordsShown: {fieldName: string, isShown: boolean}[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  setInputType(type: string): string {
    const types = ['email', 'password'];
    return types.find(el => type.includes(el)) || 'text';
  }

  turnPasswordShown(fieldName: string): void {
    let passwordIndex = this.getPasswordIndex(fieldName);
    this.passwordsShown[passwordIndex].isShown = !this.passwordsShown[passwordIndex].isShown;
  }

  getPasswordIndex(fieldName: string): number {
    return this.passwordsShown.findIndex(pass => pass.fieldName === fieldName)
  }
}
