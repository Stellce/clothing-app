import {ItemEntry} from "../order-page/order-req.model";

export interface Order {
  id: string
  itemEntries: ItemEntry[]
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

