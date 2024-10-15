import {Component, Input} from '@angular/core';
import {NewReviewComponent} from './new-review/new-review.component';
import {Review} from "./review.model";
import {ReviewComponent} from './review/review.component';

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
    standalone: true,
    imports: [NewReviewComponent, ReviewComponent]
})
export class ReviewsComponent {
  @Input() reviews: Review[];
  @Input() itemId: string;
}
