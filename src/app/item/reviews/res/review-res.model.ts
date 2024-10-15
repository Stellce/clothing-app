export interface ReviewRes {
  id: string;
  customer: Customer;
  rating: 1|2|3|4|5;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
