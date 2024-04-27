import {ItemCard} from "../categories/list-items/item-card/item-card.model";

export interface Order extends ItemCard {
  deliveryStatus?: string;
  orderDate?: string;
}

export type ItemBar = Order;
