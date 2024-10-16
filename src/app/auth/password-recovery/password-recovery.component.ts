import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute} from "@angular/router";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {DialogData} from "../../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatError,
    MatButton,
    MatLabel
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent implements OnInit {
  newPassword: string = '';
  token: string = '';
  errorMessages: string[] = [];

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onRecoverPassword() {
    if (this.validatePassword(this.newPassword) && this.token) {
      this.authService.recoverPassword(this.newPassword, this.token).subscribe({
        next: () => {
          const dialogData: DialogData = {
            title: 'Password successfully changed',
            description: 'You can now log in using it!',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        },
        error: () => {
          const dialogData: DialogData = {
            title: 'Something went wrong',
            description: 'Try again later',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        }
      });
    }
  }

  private validatePassword(password: string) {
    this.errorMessages = [];
    if (password.length < 8) this.errorMessages.push('Password must be at least 8 characters long');
    if (!/([A-Z])/.test(password)) this.errorMessages.push('Password must contain Uppercase letters');
    if (!/([a-z])/.test(password)) this.errorMessages.push('Password must contain Lowercase letters');
    if (!/(?=.*\d)/.test(password)) this.errorMessages.push('Password must contain digits');
    return !this.errorMessages.length
  }
}
