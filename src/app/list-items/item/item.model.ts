export interface Item {
  id: string;
  name: string;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  brand: string;
  rating: number;
  color: string[];
  isOnWishList: boolean;
  isNew: boolean;
  isPopular: boolean;
  images: string[];
}
