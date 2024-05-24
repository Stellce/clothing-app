import { Component } from '@angular/core';
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent {
  rating: number;
  text: string;
  stars = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]
  constructor(private authService: AuthService) {}

  getUser() {
    return this.authService.user;
  }

  setRating(rating: number) {
    this.rating = rating;
  }
  onSubmit() {

  }
}
