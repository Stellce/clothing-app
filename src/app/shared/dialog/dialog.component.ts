import {ChangeDetectionStrategy, Component, Inject, OnInit, signal, WritableSignal} from '@angular/core';
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
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Control, DialogData} from "./dialog-data.model";
import {FieldToTextPipe} from "../pipes/field-to-text";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Password} from "./password.model";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, FieldToTextPipe, MatSelect, MatOption, MatProgressSpinner, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {
  shownPasswords: WritableSignal<Password[]> = signal<Password[]>([]);
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    const controls: Control[] = [...(this.data.selects || []), ...(this.data.inputs || [])];
    const formControls: {[k: string]: AbstractControl} = Object.fromEntries(
      controls.map(({name, defaultValue, allowEmpty}) => {
        const validators = [];
        if (!allowEmpty) validators.push(Validators.required);
        if (name === 'email') validators.push(Validators.email);
        return [name, new FormControl(defaultValue, validators)];
      })
    );
    this.form = this.fb.group(formControls);
  }

  setInputType(type: string): string {
    const types = ['email', 'password'];
    return types.find(el => type.includes(el)) || 'text';
  }

  turnPasswordShown(fieldName: string): void {
    let passwordIndex = this.getPasswordIndex(fieldName);
    this.shownPasswords.update(passwords => {
      passwords[passwordIndex].isShown = !passwords[passwordIndex].isShown;
      return passwords;
    });
  }

  getPasswordIndex(fieldName: string): number {
    return this.shownPasswords().findIndex(pass => pass.fieldName === fieldName);
  }

  onCloseDialog(): void {
    if (this.form) {
      if (this.form.invalid) return;
      this.dialogRef.close(this.form);
    } else {
      this.dialogRef.close();
    }
  }
}
