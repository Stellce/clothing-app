import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from "../../auth/auth.service";
import {ItemBarComponent} from '../../item/item-bar/item-bar.component';
import {AccountService} from "./account.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    imports: [MatButtonModule, ItemBarComponent, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  constructor(
    public authService: AuthService,
    public accountService: AccountService
  ) {}
}
