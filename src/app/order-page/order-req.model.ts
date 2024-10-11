export interface OrderReq {
  itemEntries: ItemEntry[],
  customer?: UnregisteredCustomer,
  delivery?: {}
}

export interface ItemEntry {
  itemId: string,
  quantity: number,
  size: string
}

export interface UnregisteredCustomer {
  firstName: string,
  lastName: string,
  email: string
}
