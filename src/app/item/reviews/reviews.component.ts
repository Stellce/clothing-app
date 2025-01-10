import {ChangeDetectionStrategy, Component, input, InputSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {NewReviewComponent} from './new-review/new-review.component';
import {ReviewComponent} from './review/review.component';
import {AuthService} from "../../auth/auth.service";
import {ReviewsService} from "../reviews.service";
import {ReviewRes} from "./res/review-res.model";
import {OrdersService} from "../../order-page/orders.service";
import {AsyncPipe} from "@angular/common";
import {map, Observable, tap} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
    imports: [NewReviewComponent, ReviewComponent, AsyncPipe, MatProgressSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit {
  itemId: InputSignal<string> = input.required<string>();
  reviews: Observable<ReviewRes[]>;
  editableReview: WritableSignal<ReviewRes> = signal(null);
  hasCompletedOrder: WritableSignal<boolean> = signal(false);
  //review allowed when order for this item finished
  // change order status SQL script: update "order" set status 'COMPLETED' where id = '';
  isLoading = signal<boolean>(false);

  constructor(
    protected authService: AuthService,
    private reviewsService: ReviewsService,
    protected ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.getReviews();
    if (this.authService.user()) {
      this.ordersService.getOrdersForCustomer().subscribe(ordersPage => {
        const orders = ordersPage.content;
        this.hasCompletedOrder.set(orders.some(order => order.itemEntries.some(item => item.id === this.itemId()) && order.status === 'COMPLETED'));
      })
    }
  }

  getReviews() {
    this.isLoading.set(true);
    this.reviews = this.reviewsService.getReviews(this.itemId()).pipe(
      map(reviewsPage => reviewsPage.content),
      tap(reviews => {
        if (this.authService.user()) this.editableReview.set(reviews.find(r => r.customer.email === this.authService.user().email));
        this.isLoading.set(false);
      })
    )
  }

  editReview(review: ReviewRes) {
    this.editableReview.set(review);
  }
}
