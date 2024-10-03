import { NgIf } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from "../../../auth/auth.service";
import { User } from "../../../auth/user.model";
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { ItemsService } from "../../../item/items.service";
import { Order } from "../../../item/order.model";
import { AccountService } from "./account.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
  imports: [MatButtonModule, ItemBarComponent, RouterLink, NgIf]
})
export class AccountComponent implements OnInit{
  user: User;
  order: Order;

  constructor(
    private authService: AuthService,
    public accounService: AccountService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.user = this.authService.user();
    this.loginGoogle();
  }

  onLogout() {
    this.authService.logout();
  }

  private loginGoogle() {
    let code = this.route.snapshot.queryParamMap.get('code');
    if(!this.authService.user && code) 
      this.authService.loginGoogle(code).subscribe(res => console.log(res));
  }
}
