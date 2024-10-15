import {Component, EventEmitter, Input, Output} from '@angular/core';
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
export class InputQuantityComponent {
  @Input() quantity: number;
  @Output() quantityChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() min: number = 1;
  @Input() max: number = 1;

  changeQuantity(n: number) {
    const res = n + this.quantity;
    const isValidQuantity = res > 0 && this.max >= res;
    if (!isValidQuantity) return;
    this.quantity = res;
    this.quantityChange.emit(this.quantity);
  }
}
