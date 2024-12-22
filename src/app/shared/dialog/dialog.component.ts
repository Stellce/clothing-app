import {Component, Inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DialogData} from "./dialog-data.model";
import {FieldToTextPipe} from "../pipes/field-to-text";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, FieldToTextPipe, MatSelect, MatOption, MatProgressSpinner, ReactiveFormsModule]
})
export class DialogComponent implements OnInit {
  passwordsShown: {fieldName: string, isShown: boolean}[] = [];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    let controls: {[k: string]: AbstractControl} = {};
    let inputsAndSelectors = [];
    if (this.data.selects) inputsAndSelectors.push(...this.data.selects);
    if (this.data.inputs) inputsAndSelectors.push(...this.data.inputs);
    inputsAndSelectors.forEach(input => {
      controls[input.name] = new FormControl(input.defaultValue, Validators.required);
    });
    this.form = this.fb.group(controls);
    if (Object.values(this.form.value).length) console.log('Dialog form values: ', this.form.value);
  }

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
