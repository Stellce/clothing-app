import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {Review} from "./reviews/review.model";

export interface ItemDetails extends ItemCard {
  description: string;
  itemCode: string;
  reviews: Review[];
  similarItems: null;
  params?: ItemParams;
}

export interface ItemParams {
  color: string;
  brand: string;
}
