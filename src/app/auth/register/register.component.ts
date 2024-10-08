import { NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterLink } from '@angular/router';
import { AuthService } from "../auth.service";
import { RegisterUser } from "./register-user.model";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['../shared.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, RouterLink, NgIf]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  showError: boolean = false;
  showEmailResend: boolean = true;
  emailResendTimer:number = 0;
  @ViewChild('circleRef') circleRef: ElementRef;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.form = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      isAgreementConsent: new FormControl('', Validators.required)
    });
    this.authService.loginGoogle();
  }

  onRegister() {
    this.showError = true;
    if(this.form.invalid) return;
    let registerUser: RegisterUser = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      password: this.form.value.password
    }
    console.log(registerUser);
    this.authService.register(registerUser).subscribe({
      next: res => this.showEmailResend = true
    });
  }

  onActivationResend() {
    this.authService.activationResend(this.form.value.email).subscribe({
      next: () => {
        if (this.emailResendTimer) return;

        this.emailResendTimer = 15;
        this.showEmailResend = false;
        
        let interval = setInterval(() => {
          if (this.emailResendTimer) {
            this.emailResendTimer--;
          } else {
            clearInterval(interval);
            this.showEmailResend = true;
          }
        }, 1000);
      },
      error: () => {
        this.showEmailResend = true;
        this.emailResendTimer = 0;
      }
    });
  }
}
