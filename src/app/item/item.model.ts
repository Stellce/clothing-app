import {ItemCard} from "../categories/list-items/item-card/item-card.model";

export interface Item extends ItemCard{
  materials: string[];
  brand: string;
  colors: string[];
  model: string;
  reviews: string[];
}
