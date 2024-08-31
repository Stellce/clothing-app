import { Image } from "../../../item/image.model";

export interface ItemCard {
  id: string
  name: string
  price: number
  discount: number
  priceAfterDiscount: number
  brand: string
  rating: number
  color: string
  uniqueItems: UniqueItem[]
  metadata: Metadata
  images?: Image[]
}

export interface UniqueItem {
  size: string
  quantity: number
}

export interface Metadata {
  available: boolean
  onWishList: boolean
  new: boolean
  popular: boolean
}

export type CatalogItem = ItemCard;
