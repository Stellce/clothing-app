export interface ReviewReq {
  itemId: string;
  rating: 1|2|3|4|5;
  title: string;
  content: string;
}
