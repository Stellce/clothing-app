import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  googleLink = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:4200/account&response_type=code&client_id=366892792903-hcvb0cr5rdfe6afvl628isd4l900uai6.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline';
  googleIconLink = 'assets/Google__G__logo.svg'

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
  }

  onLogin() {
    if(this.form.invalid) return;
    let loginUser: LoginUser = {...this.form.value}
    this.authService.login(loginUser);
  }

  onPasswordReset() {
    this.authService.resetPassword();
  }

  private createForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }
}
