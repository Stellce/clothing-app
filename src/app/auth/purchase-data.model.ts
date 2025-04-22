export interface PurchaseData {
  deliveryAddress: PurchaseProp;
  deliveryMethod: PurchaseProp;
  paymentMethod: PurchaseProp;
  discountCode: PurchaseProp;
  wishes: PurchaseProp;
}

interface PurchaseProp {
  allowEmpty: boolean;
  value: string;
  values?: string[];
  placeholder?: string;
}
