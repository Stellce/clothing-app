export interface ItemModel {
  id: number;
  name: string;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  images: string[];
  brand: string;
  rating: number;
  colors: string[];
  isOnWishList: boolean;
  isNew: boolean;
  isPopular: boolean;
}
