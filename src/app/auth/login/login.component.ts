import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from "../auth.service";
import { LoginUser } from "./login-user.model";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../shared.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, MatIcon]
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  onLogin() {
    if(this.form.invalid) return;
    let loginUser: LoginUser = {...this.form.value}
    this.authService.login(loginUser);
  }

  onPasswordReset() {
    this.authService.resetPassword();
  }
}
