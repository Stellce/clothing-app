import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Order } from "../item/order.model";
import { OrderReq } from "./order-req.model";

@Injectable({ providedIn: 'root'})
export class OrdersService {
  backendUrl = environment.backendUrl;
  orderList: Order[] = [];
  constructor(private http: HttpClient) {}
  createOrder(orderReq: OrderReq) {
    return this.http.post(this.backendUrl + '/orders/', orderReq);
  }
}
