import { Image } from "../item/image.model";
import { ItemDetails } from "../item/item.model";

export interface LocalCartItem {
    id: string;
    quantity: number;
    itemSize: string;
    item?: ItemDetails;
    images?: Image[];
}