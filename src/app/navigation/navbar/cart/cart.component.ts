import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ItemsService} from "../../../item/items.service";
import {ItemBarComponent} from '../../../categories/item-bar/item-bar.component';
import {AsyncPipe, CurrencyPipe, NgFor, NgIf, NgStyle} from '@angular/common';
import {CartService} from './cart.service';
import {CartItem} from './cart-item.model';
import {AuthService} from 'src/app/auth/auth.service';
import {LocalService} from 'src/app/local/local.service';
import {LocalCartItem} from 'src/app/local/local-cart-item.model';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import {ItemDetails} from 'src/app/item/item.model';
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatCardTitle} from "@angular/material/card";
import {FieldToTextPipe} from "../../../pipes/field-to-text";
import {MatButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../../../dialogs/dialog/dialog.component";
import {NgForm} from "@angular/forms";
import {PurchaseData} from "../../../auth/purchase-data.model";
import {OrdersService} from "../../../order-page/orders.service";
import {OrderReq} from "../../../order-page/order-req.model";
import {AddCartReq} from "./req/add-cart-req.model";
import {AddCartRes, ItemEntryRes} from "./res/add-cart-res.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, ItemBarComponent, AsyncPipe, NgStyle, MatCheckbox, MatDivider, MatExpansionPanel, MatCardTitle, MatExpansionPanelHeader, FieldToTextPipe, CurrencyPipe, MatButton, MatProgressSpinner]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  selectedItemsIds: Set<string> = new Set<string>();
  totalCost: number = 0;
  isLoading: boolean = true;
  @ViewChildren('itemCheckbox') itemCheckboxes: QueryList<MatCheckbox>;

  constructor(
    private cartService: CartService,
    private localService: LocalService,
    private itemService: ItemsService,
    private dialog: MatDialog,
    public authService: AuthService,
    public ordersService: OrdersService
  ) {}

  ngOnInit() {
    if (this.authService.user()) {
      this.loadItems();
    } else {
      this.getLocalCartItems();
    }
  }

  onSelectAll(event: MatCheckboxChange) {
    this.itemCheckboxes.forEach((i: MatCheckbox) => {
      i.writeValue(event.checked);
    });
    this.totalCost = 0;
    if (event.checked) {
      this.cartItems.forEach(i => {
        this.selectedItemsIds.add(i.itemId)
        this.onItemSelect(i, event.checked);
      });
    } else {
      this.selectedItemsIds = new Set<string>();
    }
  }

  onItemSelect(item: CartItem, isChecked: boolean) {
    this.selectedItemsIds[isChecked ? 'add' : 'delete'](item.itemId);
    this.totalCost += (item.itemPriceAfterDiscount * item.quantity * (isChecked ? 1 : -1));
  }

  onFieldChange(field: string[]) {
    const text = new FieldToTextPipe().transform(field[0]);
    let dialogData: DialogData = {
      title: text,
      description: 'Please, provide a new value',
      inputs: [{name: field[0], defaultValue: this.authService.purchaseData()[field[0] as keyof PurchaseData]}],
      buttonName: 'Set'
    }

    if (field[0] === 'deliveryMethod') {
      dialogData = {
        ...dialogData,
        inputs: [],
        selects: [
          {name: 'Delivery Method', values: ['Parcel locker', 'Courier'], defaultValue: this.authService.purchaseData()[field[0]]}
        ]
      }
    } else if (field[0] === 'paymentMethod') {
      dialogData = {
        ...dialogData,
        inputs: [],
        selects: [
          {name: field[0], values: ['Visa', 'MasterCard'], defaultValue: this.authService.purchaseData()[field[0]]}
        ]
      }
    }

    const dialogRef: MatDialogRef<DialogComponent, NgForm> = this.dialog.open(DialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((form: NgForm) => {
      if (form?.value) this.authService.purchaseData.update(purchaseData => {
        purchaseData[field[0] as keyof typeof purchaseData] = form.value[field[0]];
        return purchaseData;
      });
    });
  }

  onBuy() {
    let order: OrderReq = {
      itemEntries: this.cartItems.filter(cItem => this.selectedItemsIds.has(cItem.itemId)).map(cItem => {
        return {
          itemId: cItem.itemId,
          quantity: cItem.quantity,
          size: cItem.itemSize
        }
      })
    }
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

      dialogRef.afterClosed().subscribe((form: NgForm) => {
        if (form?.value) {
          order.customer = {
            ...form.value
          }
        }
      });
    }
    this.ordersService.createOrder(order);
  }

  private loadItems() {
    this.cartService.getItems().subscribe(items => {
      let localItems = this.localService.getCartItems();

      if (items.length === 0 && localItems.length > 0) {
        let localItemsLoading$: Observable<AddCartRes>[] = localItems.map(lItem => {
          let addCartReq: AddCartReq = {
            itemId: lItem.itemId,
            quantity: lItem.quantity,
            size: lItem.itemSize
          }
          return this.cartService.addItem(addCartReq);
        });
        forkJoin<AddCartRes[]>(localItemsLoading$).subscribe(items => {
          console.log(items);

        })
      }
      this.cartItems = items;
      this.isLoading = false;
    });
  }

  private getLocalCartItems() {
    let localCartItems: LocalCartItem[] = this.localService.getCartItems();
    let localCartItems$: Observable<CartItem>[] = localCartItems
      .map((localCartItem, index) => this.itemService.requestItemById(localCartItem.id)
        .pipe(switchMap((itemDetails: ItemDetails) => {
          let item: CartItem = {
            id: '',
            itemId: itemDetails.id,
            itemName: itemDetails.name,
            itemSize: localCartItem.itemSize,
            quantity: this.validateQuantity(itemDetails, localCartItem),
            discount: itemDetails.discount,
            itemPrice: itemDetails.price,
            itemPriceAfterDiscount: itemDetails.priceAfterDiscount,
            totalPrice: itemDetails.price * localCartItem.quantity,
            totalPriceAfterDiscount: itemDetails.price * localCartItem.quantity,
            uniqueItems: itemDetails.uniqueItems.filter(uitem => uitem.size === localCartItem.itemSize)
          };
          return of(item);
        }))
      );
    forkJoin<CartItem[]>(localCartItems$).subscribe(items => {
      this.cartItems = items;
      this.isLoading = false;
    });
  }
  private validateQuantity(itemDetails: ItemDetails, localCartItem: LocalCartItem) {
    let maxQuantity = itemDetails.uniqueItems.find(i => i.size === localCartItem.itemSize).quantity;
    return localCartItem.quantity > maxQuantity ? maxQuantity : localCartItem.quantity;
  }

  protected readonly Object = Object;
}
