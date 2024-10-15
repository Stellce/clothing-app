import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReviewReq } from './reviews/req/review-req.model';
import { Page } from '../categories/list-items/item-card/res/page.model';
import {ReviewRes} from "./reviews/res/review-res.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly baseUrl: string = environment.backendUrl + '/reviews';

  constructor(private http: HttpClient) {}

  getReviews(itemId: string) {
    let params = new HttpParams();
    params = params.set('itemId', itemId);
    return this.http.get<Page<ReviewRes[]>>(this.baseUrl, {params});
  }

  createReview(review: ReviewReq) {
    return this.http.post(this.baseUrl, review);
  }

  updateReview(review: ReviewReq, reviewId: string) {
    return this.http.put(this.baseUrl + '/' + reviewId, review);
  }

  deleteReview(reviewId: string) {
    return this.http.delete(this.baseUrl + '/' + reviewId);
  }
}
