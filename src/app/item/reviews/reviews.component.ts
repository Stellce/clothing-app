import {Component, Input, OnInit} from '@angular/core';
import {NewReviewComponent} from './new-review/new-review.component';
import {ReviewComponent} from './review/review.component';
import {AuthService} from "../../auth/auth.service";
import {ReviewsService} from "../reviews.service";
import {ReviewRes} from "./res/review-res.model";
import {OrdersService} from "../../order-page/orders.service";
import {AsyncPipe} from "@angular/common";

@Component({
    selector: 'app-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
    standalone: true,
  imports: [NewReviewComponent, ReviewComponent, AsyncPipe]
})
export class ReviewsComponent implements OnInit {
  @Input() itemId: string;
  reviews: ReviewRes[];
  editableReview: ReviewRes;
  hasOwnReview: boolean = false;
  isPurchased: boolean = false;

  constructor(
    protected authService: AuthService,
    private reviewsService: ReviewsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.getReviews();
    if (this.authService.user()) this.checkIfPurchased();
  }

  getReviews() {
    this.reviewsService.getReviews(this.itemId).subscribe(reviewsPage => {
      this.reviews = reviewsPage.content || [];
      if (!this.reviews.length) return;
      if (!this.authService.user()) return;
      const ownReview = this.reviews.find(r => r.customer.email === this.authService.user().email);
      console.log(this.reviews, this.authService.user().email);
      if (ownReview) this.hasOwnReview = true;
    });
  }

  onEditReview(review: ReviewRes) {
    this.editableReview = review;
  }

  checkIfPurchased() {
    this.ordersService.getOrdersForCustomer().subscribe(ordersPage => {
      const orders = ordersPage.content;
      console.log(orders)
      this.isPurchased = orders.some(order => order.itemEntries.some(item => item.itemId === this.itemId));
    })
  }
}
