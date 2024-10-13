import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from "../../../auth/auth.service";
import { Review } from '../review.model';

@Component({
    selector: 'app-new-review',
    templateUrl: './new-review.component.html',
    styleUrls: ['./new-review.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule]
})
export class NewReviewComponent {
  @Input()
  isAuth: boolean;
  rating: 1|2|3|4|5;
  title: string;
  content: string;
  stars: {rate: 1|2|3|4|5}[] = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]
  constructor(public authService: AuthService) {}

  setRating(rating: 1|2|3|4|5) {
    this.rating = rating;
  }
  onSubmit() {
    const review: Review = {
      itemId: null,
      rating: this.rating,
      title: this.title,
      content: this.content
    }


  }
}
