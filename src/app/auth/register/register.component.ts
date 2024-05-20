import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterUser} from "./register-user.model";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared.scss']
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
    this.authService.register(registerUser);
  }
}
