import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {LoginUser} from "./login-user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared.scss']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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
