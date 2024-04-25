import {Component, OnInit} from '@angular/core';
import {User} from "../../../auth/user.model";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  user: User;

  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.user = this.authService.user;
  }

  onLogout() {
    this.authService.logout();
  }
}
