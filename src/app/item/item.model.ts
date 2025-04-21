import {ItemCard, UniqueItem} from "../categories/list-items/item-card/item-card.model";
import {ReviewReq} from "./reviews/req/review-req.model";
import {Category} from "../categories/category.model";

export interface ItemDetails extends ItemCard {
  gender: string,
  category: Omit<Category, "image">
  description: string;
  itemCode: string;
  reviews: ReviewReq[];
  similarItems: string[];
  params?: ItemParams;
}

export interface ItemParams {
  color: string;
  brand: string;
}

export interface CreateItem {
  name: string;
  description: string;
  price: number;
  discount: number;
  categoryId: string;
  subcategoryId?: string;
  color: string;
  gender: string;
  brandId: string;
  material: string;
  season: string;
  itemCode: string;
  uniqueItems: UniqueItem[];
}
