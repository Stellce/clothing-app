import {DatePipe, NgClass} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReviewRes} from "../res/review-res.model";
import {MatFabButton, MatMiniFabButton} from "@angular/material/button";

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
    imports: [NgClass, DatePipe, MatFabButton, MatMiniFabButton]
})
export class ReviewComponent {
  @Input() review: ReviewRes;
  @Output() editReview = new EventEmitter<void>();
  stars = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]
}
