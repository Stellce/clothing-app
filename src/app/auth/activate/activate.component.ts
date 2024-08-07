import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  title: string = 'Activation link';

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.route.snapshot.queryParamMap.get('token'))
    this.authService.activate(this.route.snapshot.queryParamMap.get('token')).subscribe({
      next: () => {},
      error: () => this.title = 'Activation link is wrong or expired'
    });
  }
}
