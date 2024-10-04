import { NgIf } from "@angular/common";
import { Component, OnInit, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../auth/user.model";
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { AccountService } from "./account.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: [MatButtonModule, ItemBarComponent, RouterLink, NgIf]
})
export class AccountComponent implements OnInit{
  user: Signal<User>;

  constructor(
    private authService: AuthService,
    public accounService: AccountService
  ) {}

  ngOnInit() {
    this.user = this.authService.user;
  }

  onLogout() {
    this.authService.logout();
  }

  
}
