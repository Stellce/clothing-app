import {Image} from "../item/image.model";

export interface LocalCartItem {
    itemId: string;
    itemSize: string;
    quantity: number;
    images?: Image[];
}
