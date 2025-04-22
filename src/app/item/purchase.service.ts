import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {PurchaseData} from "../auth/purchase-data.model";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  purchaseData: WritableSignal<PurchaseData> = signal({
    deliveryAddress: {placeholder: 'st. ExampleStreet, 12/3 45-678, ExampleCity, ExampleVoivodeship', value: '', allowEmpty: false},
    deliveryMethod: {value: 'Courier', values: ['Courier', 'Parcel locker'], allowEmpty: false},
    paymentMethod: {value: 'Card', values: ['Card', 'Google Pay', 'Apple Pay'], allowEmpty: false},
    discountCode: {value: '', allowEmpty: true},
    wishes: {value: '', allowEmpty: true}
  });
  isPurchaseDataValid = computed(() => {
    let isValid = true;
    for (const key in this.purchaseData()) {
      const ctrl = this.purchaseData()[key as keyof PurchaseData];
      if (!ctrl.allowEmpty && !ctrl.value) {
        isValid = false;
      }
    }
    return isValid;
  });
}
