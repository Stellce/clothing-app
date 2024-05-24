import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemParams} from "./item.params.model";
import {Review} from "./reviews/review.model";

export interface Item extends ItemCard {
  params: ItemParams;
  reviews: Review[];
}
