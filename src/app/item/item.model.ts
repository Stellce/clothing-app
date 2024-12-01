import {ItemCard, UniqueItem} from "../categories/list-items/item-card/item-card.model";
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

export interface CreateItem {
  name: string;
  description: string;
  price: number;
  discount: number;
  categoryId: string;
  subcategoryId?: string;
  color: string
  gender: 'MEN' | 'WOMEN';
  brandId: string
  material: string
  season: string
  itemCode: string
  uniqueItems: UniqueItem[]
}


//   "name": "Test",
//   "description": "asd",
//   "price": 100,
//   "discount": 0.3,
//   "categoryId": "a719d81d-e219-4e2e-b2d4-f5432198e783",
//   "subcategoryId": "27e1d04b-1b23-4b29-aabd-228b98d7ef1f",
//   "color": "BLACK",
//   "gender": "MEN",
//   "brandId": "9e527ff4-af9a-4c0e-88be-12bff827c877",
//   "material": "COTTON",
//   "season": "AUTUMN",
//   "itemCode": "BXM50961",
//   "uniqueItems": [
//   {
//     "size": "XS",
//     "quantity": 10
//   },
//   {
//     "size": "S",
//     "quantity": 10
//   },
//   {
//     "size": "M",
//     "quantity": 10
//   },
//   {
//     "size": "L",
//     "quantity": 10
//   },
//   {
//     "size": "XL",
//     "quantity": 10
//   }
// ]
