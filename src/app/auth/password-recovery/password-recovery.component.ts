import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
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
        MatLabel,
        MatIconButton,
        MatSuffix
    ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent implements OnInit {
  newPassword: string = '';
  token: string = '';
  errorMessages: string[] = [];
  isPasswordShown: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onRecoverPassword() {
    this.errorMessages = this.authService.errorsOnPasswordValidation(this.newPassword)
    if (!this.token) {
      const data: DialogData = {
        title: 'Unable to proceed',
        description: 'Link is expired'
      }
      this.dialog.open(DialogComponent, {data});
      this.router.navigate(['/login']);
    } else if (!this.errorMessages.length) {
      this.authService.recoverPassword(this.newPassword, this.token).subscribe({
        next: () => {
          this.router.navigate(['/']);
          const data: DialogData = {
            title: 'Password successfully changed',
            description: 'You can now log in using it!',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data});
        },
        error: err => {
          this.router.navigate(['/']);
          const data: DialogData = {
            title: 'Something went wrong',
            description: `Try again later. ${err['status'] ? `Error ${err['status']} occurred` : ''}`,
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data});
        }
      });
    }
  }

  turnPasswordShown() {
    this.isPasswordShown.update(isShown => !isShown);
  }
}
