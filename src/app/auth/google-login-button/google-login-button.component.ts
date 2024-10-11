import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.scss'
})
export class GoogleLoginButtonComponent {
  googleLink = 'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:4200/account&response_type=code&client_id=366892792903-hcvb0cr5rdfe6afvl628isd4l900uai6.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&access_type=offline';

}
