import {Filter} from "../../filter/filter.model";

export interface ItemsParamsRequest extends Filter{
  gender: string,
  categoryId: string,
  subcategoryId?: string
}
