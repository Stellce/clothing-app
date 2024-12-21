import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {DialogData} from "../../shared/dialog/dialog-data.model";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, RouterLink, GoogleLoginButtonComponent, MatProgressSpinner, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  protected readonly showError: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly showEmailResend: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly emailResendTimer: WritableSignal<number> = signal<number>(0);
  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly passwordErrors: WritableSignal<string[]> = signal<string[]>([]);
  protected readonly isPasswordShown: WritableSignal<boolean> = signal<boolean>(false);
  form: FormGroup;

  constructor(
    protected authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.setForms();
    this.checkGoogleAuth();
  }

  onRegister() {
    this.showError.set(true);
    this.passwordErrors.set(this.authService.errorsOnPasswordValidation(this.form.controls['password'].value))
    if(this.form.invalid || this.passwordErrors().length) return;
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
        const status = err['status'];
        const description = status === 409 ? 'Email already registered' :
          status === 400 ? 'Validation failed' :
          status === 503 ? 'Service unavailable' : '';
        const data: DialogData = {
          title: 'Registration failed',
          description
        }
        this.dialog.open(DialogComponent, {data});
        this.isLoading.set(false);
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
          description: `Try again later`
        }
        this.dialog.open(DialogComponent, {data});
        this.showEmailResend.set(true);
        this.emailResendTimer.set(0);
        console.error(err);
      }
    });
  }

  turnPasswordShown() {
    this.isPasswordShown.update(isShown => !isShown);
  }

  private setForms() {
    this.form = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]],
      isAgreementConsent: ['', Validators.required]
    })
  }

  private checkGoogleAuth() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if(this.authService.user() || !code) return;
    this.isLoading.set(true);
    this.authService.loginGoogle(code);
  }
}
