import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ItemParams} from "./item.params.model";
import {Review} from "./reviews/review.model";
import {Image} from "./image.model";

export interface ItemDetails extends ItemCard {
  description: string;
  availableSizes: string[];
  isAvailable: boolean;
  itemCode: string;
  reviews: Review[];
  reviewsCount: null
  similarItems: null,
  sizes: string[];

  params?: ItemParams;
  images?: Image[];
}

