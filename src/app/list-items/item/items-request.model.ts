import {Filter} from "../filter/filter.model";

export interface ItemsRequest {
  gender: string,
  categoryId: string,
  subcategoryId?: string,
  pageNumber?: string,
  filter?: Filter
}
