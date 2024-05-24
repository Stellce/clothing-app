import {Component, Input} from '@angular/core';
import {Review} from "../review.model";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  @Input()
  review: Review;
  rating: number;
  stars = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]
}