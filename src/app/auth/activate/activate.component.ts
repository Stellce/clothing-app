import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  title: string = 'Activating account...';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.route.snapshot.queryParamMap.get('token'))
    this.router.navigate(['/', 'account']);
    this.authService.activateAccount(this.route.snapshot.queryParamMap.get('token')).subscribe({
      next: res => {
        console.log(res)
        this.title = 'Activation success! You will be redirected in a second'
        setTimeout(() => this.router.navigate(['/', 'account']), 1000);
      },
      error: () => this.title = 'Activation link is wrong or expired'
    });
  }
}
