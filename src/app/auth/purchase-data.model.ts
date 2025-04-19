export interface PurchaseData {
  deliveryAddress: PurchaseProp;
  deliveryMethod: PurchaseProp;
  paymentMethod: PurchaseProp;
  discountCode: PurchaseProp;
  wishes: PurchaseProp;
}

interface PurchaseProp {
  placeholder: string;
  value: string;
  isEditable: boolean;
  allowEmpty: boolean;
}
