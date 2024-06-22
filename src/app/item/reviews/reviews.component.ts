import {Component, Input} from '@angular/core';
import {Review} from "./review.model";
import {AuthService} from "../../auth/auth.service";
import { ReviewComponent } from './review/review.component';
import { NgFor } from '@angular/common';
import { NewReviewComponent } from './new-review/new-review.component';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
    standalone: true,
    imports: [NewReviewComponent, NgFor, ReviewComponent]
})
export class ReviewsComponent {
  @Input()
  reviews: Review[];
  constructor(private authService: AuthService) {}

  isAuth(): boolean {
    return !!this.authService.user;
  }

}
