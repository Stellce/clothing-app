export interface OrderReq {
  itemEntries: ItemEntryReq[],
  customer?: UnregisteredCustomer,
  delivery?: {}
}

export interface ItemEntryReq {
  itemId: string,
  quantity: number,
  size: string
}

export interface UnregisteredCustomer {
  firstName: string,
  lastName: string,
  email: string
}
