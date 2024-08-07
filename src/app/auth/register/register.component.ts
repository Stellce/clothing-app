import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {RegisterUser} from "./register-user.model";
import {AuthService} from "../auth.service";
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../shared.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      isAdult: new FormControl('', Validators.required),
      isAgreementConsent: new FormControl('', Validators.required)
    })
  }

  onRegister() {
    console.log(this.form.value)
    if(this.form.invalid) return;
    let registerUser: RegisterUser = {
      ...this.form.value
    }
    this.authService.register(registerUser).subscribe({
      next: res => this.form.reset()
    });
  }
}
