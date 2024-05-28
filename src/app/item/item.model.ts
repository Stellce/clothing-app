import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemParams} from "./item.params.model";
import {Review} from "./reviews/review.model";
import {Image} from "./image.model";

export interface Item extends ItemCard, ItemParams {
  params?: ItemParams;
  reviews: Review[];
  images?: Image[];

  sizes: string[];
  availableSizes: string[];

  rating: number,

  itemCode: string;

  similarItems: null,
  reviewsCount: null,
  isAvailable: true,
}
