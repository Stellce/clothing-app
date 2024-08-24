import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {OrderReq} from "./order-req.model";
import {Order} from "../item/order.model";

@Injectable({ providedIn: 'root'})
export class OrdersService {
  backendUrl = environment.backendUrl;
  orderList: Order[] = [];
  constructor(private http: HttpClient) {}
  createOrder(orderReq: OrderReq) {
    return this.http.post(this.backendUrl + '/orders/', orderReq);
  }
}
