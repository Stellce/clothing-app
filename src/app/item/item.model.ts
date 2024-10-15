import {ItemCard} from "../categories/list-items/item-card/item-card.model";
import {ReviewReq} from "./reviews/req/review-req.model";

export interface ItemDetails extends ItemCard {
  description: string;
  itemCode: string;
  reviews: ReviewReq[];
  similarItems: null;
  params?: ItemParams;
}

export interface ItemParams {
  color: string;
  brand: string;
}
