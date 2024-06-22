import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import {DialogData} from "./dialog-data.model";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, FormsModule, NgFor, MatFormFieldModule, MatInputModule, NgIf, MatIconModule, MatButtonModule]
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
