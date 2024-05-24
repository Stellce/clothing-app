import {Component, Input} from '@angular/core';
import {Review} from "./review.model";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @Input()
  reviews: Review[];
  constructor(private authService: AuthService) {}

  isAuth(): boolean {
    return !!this.authService.user;
  }

}
