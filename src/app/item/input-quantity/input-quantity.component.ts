import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  InputSignal,
  OnChanges,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import {MatMiniFabButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgStyle} from "@angular/common";

@Component({
    selector: 'app-input-quantity',
    imports: [
        MatMiniFabButton,
        ReactiveFormsModule,
        FormsModule,
        NgStyle
    ],
    templateUrl: './input-quantity.component.html',
    styleUrl: './input-quantity.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputQuantityComponent implements OnChanges {
  private _quantity: WritableSignal<number> = signal(0);
  quantityChange: OutputEmitterRef<number> = output<number>();
  min: InputSignal<number> = input(1);
  max: InputSignal<number> = input(1);

  @Input()
  set quantity(value: number) {
    this._quantity.set(value > this.max() ? this.max() : value < this.min() ? this.min() : value);
  };
  get quantity() {
    return this._quantity();
  }

  input: Signal<HTMLInputElement> = viewChild<HTMLInputElement>('input');

  ngOnChanges() {
    if (this.input) this.forbidIllegalQuantity(this.quantity, this.input());
  }

  changeQuantity(n: number) {
    const res = n + this.quantity;
    const isValidQuantity = res > 0 && this.max() >= res;
    if (!isValidQuantity) return;
    this.quantity = res;
    this.quantityChange.emit(this.quantity);
  }

  forbidIllegalQuantity(quantity: number, input: HTMLInputElement) {
    if (quantity > this.max()) {
      this.quantity = this.max();
      input.value = this.quantity.toString();
    } else if (quantity < this.min()) {
      this.quantity = this.min();
      input.value = this.quantity.toString();
    }
  }
}
