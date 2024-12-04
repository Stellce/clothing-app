import {Image} from "../../../item/image.model";

export interface AddCartRes {
  id: string
  itemEntries: ItemEntryRes[]
  createdAt: string
  totalPrice: number
  totalPriceAfterDiscount: number
  status: string
  number: string
}

export interface ItemEntryRes {
  id: string
  itemId: string
  itemName: string
  itemSize: string
  quantity: number
  discount: number
  itemPrice: number
  itemPriceAfterDiscount: number
  totalPrice: number
  totalPriceAfterDiscount: number
  images?: Image[];
}
