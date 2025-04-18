import {ChangeDetectionStrategy, Component, computed, OnInit, signal, WritableSignal} from '@angular/core';
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
import {finalize} from "rxjs";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../shared.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, RouterLink, GoogleLoginButtonComponent, MatProgressSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  showAgreementError: WritableSignal<boolean> = signal<boolean>(false);
  showEmailResend: WritableSignal<boolean> = signal<boolean>(false);
  emailResendTimeout: WritableSignal<number> = signal<number>(0);
  emailSpinnerValue = computed(() => this.emailResendTimeout() / 150);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  passwordErrors: WritableSignal<string[]> = signal<string[]>([]);
  isPasswordShown: WritableSignal<boolean> = signal<boolean>(false);
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
    this.showAgreementError.set(!this.form.controls['isAgreementConsent'].value);
    this.passwordErrors.set(this.authService.errorsOnPasswordValidation(this.form.controls['password'].value))
    if(this.form.invalid || this.passwordErrors().length) return;
    let registerUser: RegisterUser = {
      firstName: this.form.value.firstname,
      lastName: this.form.value.lastname,
      email: this.form.value.email,
      password: this.form.value.password
    }
    this.isLoading.set(true);
    this.authService.register(registerUser).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => {
        this.showEmailResend.set(true);
      },
      error: err => {
        console.log(err);
        const status = err['status'];
        const description = status === 409 ? 'Email is already registered' :
          status === 400 ? 'Validation failed' :
          status === 503 ? 'Service unavailable' : status;
        const data: DialogData = {
          title: 'Registration failed',
          description
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  onActivationResend() {
    this.authService.activationResend(this.form.value.email)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          const data: DialogData = {
            title: 'Activation resent',
            description: 'Check your email'
          }
          this.dialog.open(DialogComponent, {data});

          if (this.emailResendTimeout()) return;

          this.emailResendTimeout.set(15_000);
          this.showEmailResend.set(false);

          const interval = setInterval(() => {
            if (this.emailResendTimeout()) {
              this.emailResendTimeout.update(time => time - 100);
            } else {
              clearInterval(interval);
              this.showEmailResend.set(true);
            }
          }, 100);
        },
        error: err => {
          const data: DialogData = {
            title: `Activation resend went wrong`,
            description: `Try again later`
          }
          this.dialog.open(DialogComponent, {data});
          this.showEmailResend.set(true);
          this.emailResendTimeout.set(0);
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
      isAgreementConsent: ['', Validators.requiredTrue]
    })
  }

  private checkGoogleAuth() {
    const code = this.route.snapshot.queryParamMap.get('code');
    if(this.authService.user() || !code) return;
    this.isLoading.set(true);
    this.authService.loginGoogle(code);
  }

  protected readonly Math = Math;
}
