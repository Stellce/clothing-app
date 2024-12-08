import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {OrderReq} from "./order-req.model";
import {OrderRes} from "./order-res.model";
import {Page} from "../categories/list-items/item-card/res/page.model";

@Injectable({ providedIn: 'root'})
export class OrdersService {
  ordersUrl = environment.backendUrl + '/orders';

  constructor(private http: HttpClient) {}

  getOrderById(orderId: string) {
    return this.http.get<OrderRes>(this.ordersUrl + `/${orderId}`);
  }

  createOrder(orderReq: OrderReq) {
    console.log('orderReq: ', orderReq);
    return this.http.post(this.ordersUrl + '/', orderReq);
  }

  getOrdersForCustomer() {
    return this.http.get<Page<OrderRes[]>>(this.ordersUrl + `/customer`);
  }

  cancelOrder(orderId: string) {
    return this.http.delete(this.ordersUrl + `/${orderId}`);
  }
}
