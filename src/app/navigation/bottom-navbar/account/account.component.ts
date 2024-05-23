import {Component, OnInit} from '@angular/core';
import {User} from "../../../auth/user.model";
import {AuthService} from "../../../auth/auth.service";
import {ItemsService} from "../../../item/items.service";
import {Order} from "../../../item/order.model";
import {AccountService} from "./account.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit{
  user: User;
  order: Order;

  constructor(
    private authService: AuthService,
    private itemsService: ItemsService,
    public accounService: AccountService
  ) {}
  ngOnInit() {
    this.user = this.authService.user;
    this.itemsService.getLastOrder().subscribe(order => {
      this.order = order;
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
