import {ItemEntryReq} from "../order-page/order-req.model";

export interface Order {
  id: string
  itemEntries: ItemEntryReq[]
  delivery: Delivery
  createdAt: string
  totalPrice: number
  totalPriceAfterDiscount: number
  number: string
  status: string
}

export interface Delivery {
  status: string;
}

