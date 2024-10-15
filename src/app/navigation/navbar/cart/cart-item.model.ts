import {Image} from "src/app/item/image.model"

export interface CartItem {
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
