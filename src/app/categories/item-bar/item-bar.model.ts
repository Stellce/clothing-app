import {ItemCard} from "../list-items/item-card/item-card.model";

export interface ItemBar extends ItemCard {
  deliveryStatus?: string;
  orderDate?: string;
}
