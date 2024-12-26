import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {AuthService} from "../../auth/auth.service";
import {AccountService} from "./account.service";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    imports: [MatButtonModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  constructor(
    public authService: AuthService,
    public accountService: AccountService
  ) {}
}
