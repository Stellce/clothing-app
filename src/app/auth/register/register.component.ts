import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from "../auth.service";
import {RegisterUser} from "./register-user.model";
import {GoogleLoginButtonComponent} from "../google-login-button/google-login-button.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {DialogData} from "../../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, RouterLink, GoogleLoginButtonComponent, MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  protected readonly form: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    isAgreementConsent: new FormControl('', Validators.required)
  });
  protected readonly showError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly showEmailResend: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly emailResendTimer: WritableSignal<number> = signal<number>(0);
  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    protected authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.checkGoogleAuth();
  }

  onRegister() {
    this.showError.set(true);
    if(this.form.invalid) return;
    let registerUser: RegisterUser = {
      firstName: this.form.value.firstname,
      lastName: this.form.value.lastname,
      email: this.form.value.email,
      password: this.form.value.password
    }
    console.log(registerUser);
    this.isLoading.set(true);
    this.authService.register(registerUser).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showEmailResend.set(true);
      },
      error: err => {
        this.isLoading.set(true);
        const data: DialogData = {
          title: 'Registration failed',
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  onActivationResend() {
    this.authService.activationResend(this.form.value.email).subscribe({
      next: () => {
        if (this.emailResendTimer) return;

        this.emailResendTimer.set(15);
        this.showEmailResend.set(false);

        let interval = setInterval(() => {
          if (this.emailResendTimer) {
            this.emailResendTimer.update(time => time--);
          } else {
            clearInterval(interval);
            this.showEmailResend.set(true);
          }
        }, 1000);
      },
      error: err => {
        const data: DialogData = {
          title: `Activation resend went wrong`,
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
        this.showEmailResend.set(true);
        this.emailResendTimer.set(0);
      }
    });
  }

  private checkGoogleAuth() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if(this.authService.user() || !code) return;
    this.isLoading.set(true);
    this.authService.loginGoogle(code);
  }
}
