import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from "../auth.service";
import { LoginUser } from "./login-user.model";
import {GoogleLoginButtonComponent} from "../google-login-button/google-login-button.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";
import {DialogData} from "../../dialogs/dialog/dialog-data.model";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../shared.scss'],
    standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, GoogleLoginButtonComponent]
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createForm();
  }

  onLogin() {
    if(this.form.invalid) return;
    let loginUser: LoginUser = {...this.form.value}
    this.authService.login(loginUser).subscribe({
      next: () => this.isLoading = false,
      error: () => {
        const dialogData: DialogData = {
          title: 'Unable to log in',
          description: 'username or password is not valid',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
        this.isLoading = false;
      }
    });
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
