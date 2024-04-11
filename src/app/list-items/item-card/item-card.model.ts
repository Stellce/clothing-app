export interface ItemCard {
  id: string;
  name: string;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  brand: string;
  isOnWishList: boolean;
  isNew: boolean;
  isPopular: boolean;
  images: string[];
}
