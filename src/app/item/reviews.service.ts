import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Review } from './reviews/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly baseUrl: string = environment.backendUrl + '/reviews';

  constructor(private http: HttpClient) {}

  getReviews(itemId: string) {
    let headers = new HttpHeaders();
    headers = headers.set('itemId', itemId);
    return this.http.get(this.baseUrl, {headers});
  }

  createReview(review: Review) {
    return this.http.post(this.baseUrl, review);
  }

  updateReview(review: Review, reviewId: string) {
    return this.http.put(this.baseUrl + '/' + reviewId, review);
  }

  deleteReview(reviewId: string) {
    return this.http.delete(this.baseUrl + '/' + reviewId);
  }
}
