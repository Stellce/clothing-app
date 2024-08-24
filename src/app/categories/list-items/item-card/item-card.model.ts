import {Image} from "../../../item/image.model";

export interface ItemCard {
  id: string
  name: string
  price: number
  discount: number
  priceAfterDiscount: number
  brand: string
  rating: number
  color: string
  isOnWishList: boolean
  isNew: boolean
  isPopular: boolean
  uniqueItems: UniqueItem[]
  images?: Image[]
}

export interface UniqueItem {
  size: string
  quantity: number
}

export type CatalogItem = ItemCard;
