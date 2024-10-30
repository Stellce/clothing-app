import {CurrencyPipe, NgClass, NgStyle} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from '../auth/auth.service';
import {BreadcrumbComponent} from '../categories/list-items/breadcrumb/breadcrumb.component';
import {UniqueItem} from '../categories/list-items/item-card/item-card.model';
import {CartService} from '../navigation/navbar/cart/cart.service';
import {FieldToTextPipe} from '../pipes/field-to-text';
import {Image} from "./image.model";
import {ItemDetails} from "./item.model";
import {ItemsService} from "./items.service";
import {ReviewsComponent} from './reviews/reviews.component';
import {AddToFavoritesComponent} from "./add-to-favorites/add-to-favorites.component";
import {MatRipple} from "@angular/material/core";
import {InputQuantityComponent} from "./input-quantity/input-quantity.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogs/dialog/dialog.component";
import {OrdersService} from "../order-page/orders.service";
import {OrderReq} from "../order-page/order-req.model";
import {UpdateCartItemReq} from "../navigation/navbar/cart/req/update-cart-req.model";
import {DialogData} from "../dialogs/dialog/dialog-data.model";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    standalone: true,
  imports: [BreadcrumbComponent, NgClass, MatButtonModule, ReviewsComponent, CurrencyPipe, MatFormFieldModule, MatInputModule, FormsModule, NgStyle, FieldToTextPipe, AddToFavoritesComponent, MatRipple, InputQuantityComponent]
})
export class ItemComponent implements OnInit{
  item: ItemDetails = null;
  selectedUniqueItem: UniqueItem;
  quantity: number = 1;
  params: { key: string, value: string }[] = [];
  selectedImageIndex: number = 0;
  isCartItem: boolean = false;
  constructor(
    private itemsService: ItemsService,
    protected route: ActivatedRoute,
    private cartService: CartService,
    private dialog: MatDialog,
    private ordersService: OrdersService,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    this.requestItem();
  }

  setUniqueItem(uniqueItem: UniqueItem) {
    this.selectedUniqueItem = uniqueItem;
    if (this.quantity > uniqueItem.quantity) this.quantity = uniqueItem.quantity;
  }

  addToCart() {
    const successDialogInvoke = () => {
      let dialogData: DialogData = {
        title: 'Item added!',
        description: 'You can check your cart!'
      };
      this.dialog.open(DialogComponent, {data: dialogData});
    }
    if (this.quantity > this.selectedUniqueItem.quantity) return;

    if (this.authService.user()) {
      this.cartService.addItem({
        itemId: this.item.id,
        quantity: this.quantity,
        size: this.selectedUniqueItem.size
      }).subscribe({
        next: () => successDialogInvoke(),
        error: e => console.error(e)
      });
    } else {
      const dialogData: DialogData = {
        title: 'Unable to add to cart',
        description: 'You have to be registered',
        buttonName: 'Ok'
      }
      this.dialog.open(DialogComponent, {data: dialogData});
    }
  }

  orderNow() {
    const addOrder = (orderReq: OrderReq) => {
      this.ordersService.createOrder(orderReq).subscribe({
        next: () => {
          const dialogData: DialogData = {
            title: 'Item purchased!',
            description: 'You will get a notification on email',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        },
        error: () => {
          const dialogData: DialogData = {
            title: 'Something went wrong',
            description: 'Could not proceed',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        }
      });
    }
    let order: OrderReq = {
      itemEntries: [{
        itemId: this.item.id,
        quantity: this.quantity,
        size: this.selectedUniqueItem.size
      }]
    };
    if (!this.authService.user()) {
      let dialogData = {
        title: 'User data',
        description: 'You are not authenticated, you can login, register, or fill these fields',
        inputs: [
          {name: 'firstName'},
          {name: 'lastName'},
          {name: 'email'},
        ],
        buttonName: 'Submit'
      }
      const dialogRef: MatDialogRef<DialogComponent, NgForm> = this.dialog.open(DialogComponent, {data: dialogData});
      dialogRef.afterClosed().subscribe(form => {
        if (!form.value) return;
        order = {...order, customer: {...form.value}}
        addOrder(order);
      })
    } else {
      addOrder(order);
    }
  }

  sizeString(size: string): string {
    let split = size.split("X");
    let splitNoEmpty = split.filter(Boolean).toString();
    let numOfXes = split.length - splitNoEmpty.length;
    return size.length > 2 ? numOfXes + "X" + splitNoEmpty : size;
  }

  onSaveCartItem() {
    const success = () => {
      const dialogData: DialogData = {
        title: 'Item updated!',
        description: 'Check your cart!',
        buttonName: 'Ok'
      }
      this.dialog.open(DialogComponent, {data: dialogData});
    }
    const failure = () => {
      const dialogData: DialogData = {
        title: 'Something went wrong!',
        description: 'Try again later!',
        buttonName: 'Ok'
      }
      this.dialog.open(DialogComponent, {data: dialogData});
    }
    const cartItem: UpdateCartItemReq = {
      entryId: this.route.snapshot.paramMap.get('id'),
      quantity: this.quantity,
      size: this.selectedUniqueItem.size
    }
    this.cartService.updateItem(cartItem).subscribe({
      next: success,
      error: failure
    });
  }

  private requestItem() {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    this.itemsService.requestItemById(itemId).subscribe((item: ItemDetails) => {
      if(!item) return;
      this.item = item;
      this.selectedUniqueItem = item.uniqueItems.find(i => i.quantity > 0);
      this.item.params = {
        color: this.item.color,
        brand: this.item.brand
      };
      Object.entries(this.item.params).forEach(([key, value]) => this.params.push({key, value}))
      this.itemsService.requestItemImages(item.id).subscribe((images: Image[]) => {
        this.item.images = images;
      })
      this.route.queryParamMap.subscribe(params => {
        const quantity = +params.get('quantity');
        if (quantity) this.isCartItem = true;
        this.quantity = quantity || 1;
        this.selectedUniqueItem = this.item.uniqueItems.find(uItem => uItem.size === params.get('size')) || this.item.uniqueItems[0];
      })
    });
  }
}
