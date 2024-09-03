import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from "../../../auth/auth.service";

@Component({
    selector: 'app-new-review',
    templateUrl: './new-review.component.html',
    styleUrls: ['./new-review.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass, FormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule]
})
export class NewReviewComponent {
  @Input()
  isAuth: boolean;
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
