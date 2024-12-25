import {TextFieldModule} from '@angular/cdk/text-field';
import {AsyncPipe, NgClass} from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AuthService} from "../../../auth/auth.service";
import {ReviewReq} from '../req/review-req.model';
import {ReviewsService} from "../../reviews.service";
import {ReviewRes} from "../res/review-res.model";

@Component({
    selector: 'app-new-review',
    templateUrl: './new-review.component.html',
    styleUrls: ['./new-review.component.scss'],
    imports: [NgClass, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule, ReactiveFormsModule, AsyncPipe]
})
export class NewReviewComponent implements OnInit, OnChanges {
  review = input<ReviewRes>();
  @Input() itemId: string;
  @Output() updateReviews = new EventEmitter<void>();
  @ViewChildren('starX') starsRef: QueryList<any>;
  form: FormGroup;
  stars: {rate: 1|2|3|4|5}[] = [
    {rate: 1},
    {rate: 2},
    {rate: 3},
    {rate: 4},
    {rate: 5}
  ]

  constructor(
    public authService: AuthService,
    private reviewsService: ReviewsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      rating: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review'].currentValue) {
      console.log(this.starsRef);
      this.form.patchValue({
        title: this.review().title,
        content: this.review().content,
        rating: this.review().rating
      })
    }
  }

  onSubmit() {
    const review: ReviewReq = {
      itemId: this.itemId,
      ...this.form.value
    }

    this.reviewsService.createReview(review).subscribe({
      next: () => {
        this.updateReviews.emit();
      },
      error: () => {}
    })
  }

  onUpdate() {
    const review: ReviewReq = {
      itemId: this.itemId,
      ...this.form.value
    }
    this.reviewsService.updateReview(review, this.review().id).subscribe({
      next: () => this.updateReviews.emit(),
      error: () => {}
    })
  }
}
