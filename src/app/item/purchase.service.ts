import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {PurchaseData} from "../auth/purchase-data.model";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  purchaseData: WritableSignal<PurchaseData> = signal({
    deliveryAddress: {placeholder: 'st. ExampleStreet, 12/3 45-678, ExampleCity, ExampleVoivodeship', value: '', isEditable: true, allowEmpty: false},
    deliveryMethod: {placeholder: 'Courier', value: 'Courier', isEditable: false, allowEmpty: false},
    paymentMethod: {placeholder: 'Card', value: 'Card', isEditable: false, allowEmpty: false},
    discountCode: {placeholder: '', value: '', isEditable: true, allowEmpty: true},
    wishes: {placeholder: '', value: '', isEditable: true, allowEmpty: true}
  });
  isPurchaseDataValid = computed(() => {
    let isValid = true;
    for (const key in this.purchaseData()) {
      const ctrl = this.purchaseData()[key as keyof PurchaseData];
      if (!ctrl.allowEmpty && !ctrl.value) isValid = false;
    }
    return isValid;
  });
}
