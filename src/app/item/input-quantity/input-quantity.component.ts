import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from '@angular/core';
import {MatMiniFabButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-input-quantity',
  standalone: true,
  imports: [
    MatMiniFabButton,
    ReactiveFormsModule,
    FormsModule,
    NgStyle
  ],
  templateUrl: './input-quantity.component.html',
  styleUrl: './input-quantity.component.scss'
})
export class InputQuantityComponent implements OnChanges {
  private _quantity: number;

  @Input()
  set quantity(value: number) {
    this._quantity = value > this.max ? this.max : value < this.min ? this.min : value;
  };
  get quantity() {
    return this._quantity;
  }

  @Output() quantityChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() min: number = 1;
  @Input() max: number = 1;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  ngOnChanges() {
    if (this.input) this.forbidIllegalQuantity(this.quantity, this.input.nativeElement);
  }

  changeQuantity(n: number) {
    const res = n + this.quantity;
    const isValidQuantity = res > 0 && this.max >= res;
    if (!isValidQuantity) return;
    this.quantity = res;
    this.quantityChange.emit(this.quantity);
  }

  forbidIllegalQuantity(quantity: number, input: HTMLInputElement) {
    if (quantity > this.max) {
      this.quantity = this.max;
      input.value = this.quantity.toString();
    } else if (quantity < this.min) {
      this.quantity = this.min;
      input.value = this.quantity.toString();
    }
  }
}
