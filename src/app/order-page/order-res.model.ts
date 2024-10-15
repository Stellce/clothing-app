import {ItemEntryRes} from "../navigation/navbar/cart/res/add-cart-res.model";

export interface OrderRes {
  id: string
  itemEntries: ItemEntryRes[]
  createdAt: string
  totalPrice: number
  totalPriceAfterDiscount: number
  status: string
  number: string
}
