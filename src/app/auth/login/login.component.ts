import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {AuthService} from "../auth.service";
import {LoginUser} from "./login-user.model";
import {GoogleLoginButtonComponent} from "../google-login-button/google-login-button.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/dialog/dialog.component";
import {DialogData} from "../../shared/dialog/dialog-data.model";
import {finalize} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../shared.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, GoogleLoginButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isPasswordShown: WritableSignal<boolean> = signal<boolean>(false);

  constructor(
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  onLogin() {
    if(this.form.invalid) return;
    this.isLoading.set(true);
    let loginUser: LoginUser = {...this.form.value}
    this.authService.login(loginUser).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => {},
      error: err => {
        const status = err['status'];
        const description = status === 400 ? `Account is not activated` : `Username or password is not valid.`;
        const data: DialogData = {
          title: 'Unable to log in',
          description,
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }

  onPasswordReset() {
    this.authService.sendPasswordRecovery(this.form.value['username']);
  }

  turnPasswordShown() {
    this.isPasswordShown.update(isShown => !isShown);
  }

  private createForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
