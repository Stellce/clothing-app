import { CatalogItem } from "../item-card.model"

export interface ItemsPage {
  content: CatalogItem[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: any[]
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface Pageable {
  sort: any[]
  offset: number
  pageSize: number
  pageNumber: number
  paged: boolean
  unpaged: boolean
}
