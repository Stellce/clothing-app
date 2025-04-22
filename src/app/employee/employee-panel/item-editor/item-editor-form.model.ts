import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {UniqueItem} from "../../../categories/list-items/item-card/item-card.model";


export interface ItemEditorForm {
  images: File[],
  brandName: string,
  gender: string,
  color: string,
  itemCode: string,
  description: string,
  discount: number,
  categoryName: string,
  subcategoryName: string,
  material: string,
  price: number,
  name: string,
  season: string
}

export type ToFormControls<T> = {
  [K in keyof T]: FormControl<T[K]>
}

export type ToTypeOrFormControls<T> = {
  [K in keyof T]: (T[K] | ((control: FormControl) => (ValidationErrors | null)))[]
}

export type UniqueItemTypeOrFormControls = {
  size: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
  quantity: (number | ((control: AbstractControl) => (ValidationErrors | null)))[]
}

export type UniqueItemsFormControls = FormArray<FormGroup<ToFormControls<UniqueItem>>>
export type ItemEditorFormControls = ToFormControls<ItemEditorForm> & { uniqueItems: UniqueItemsFormControls }
