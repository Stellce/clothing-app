import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {OrderReq} from "./order-req.model";
import {OrderRes} from "./order-res.model";
import {Page} from "../categories/list-items/item-card/res/page.model";
import {DialogData} from "../shared/dialog/dialog-data.model";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Injectable({ providedIn: 'root'})
export class OrdersService {
  ordersUrl = environment.backendUrl + '/orders';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  addOrder(orderReq: OrderReq, loadingDialog?: MatDialogRef<DialogComponent>) {
    this.createOrder(orderReq).subscribe({
      next: () => {
        const dialogData: DialogData = {
          title: 'Item purchased!',
          description: 'You will get a notification on email',
          buttonName: 'Ok'
        };
        this.dialog.open(DialogComponent, {data: dialogData}).afterOpened().subscribe({
          next:() => loadingDialog?.close()
        });
      },
      error: err => {
        const dialogData: DialogData = {
          title: 'Something went wrong',
          description: 'Could not proceed',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData}).afterOpened().subscribe({
          next:() => loadingDialog?.close()
        });
        console.error(err);
      }
    });
  }

  getOrderById(orderId: string) {
    return this.http.get<OrderRes>(this.ordersUrl + `/${orderId}`);
  }

  createOrder(orderReq: OrderReq) {
    return this.http.post(this.ordersUrl, orderReq);
  }

  getOrdersForCustomer() {
    return this.http.get<Page<OrderRes[]>>(this.ordersUrl + `/customer`);
  }

  cancelOrder(orderId: string) {
    return this.http.delete(this.ordersUrl + `/${orderId}`);
  }
}
