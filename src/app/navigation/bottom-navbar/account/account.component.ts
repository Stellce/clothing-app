import {Component, OnInit} from '@angular/core';
import {User} from "../../../auth/user.model";
import {AuthService} from "../../../auth/auth.service";
import {ItemsService} from "../../../item/items.service";
import {Order} from "../../../item/order.model";
import {AccountService} from "./account.service";
import { RouterLink } from '@angular/router';
import { ItemBarComponent } from '../../../categories/item-bar/item-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, ItemBarComponent, RouterLink]
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
    // this.itemsService.getLastOrder().subscribe(order => {
    //   this.order = order;
    // });
  }

  onLogout() {
    this.authService.logout();
  }
}
