import {ChangeDetectionStrategy, Component, OnInit, Signal, signal, viewChildren, WritableSignal} from '@angular/core';
import {ItemBarComponent} from '../../../categories/item-bar/item-bar.component';
import {AsyncPipe, CurrencyPipe, NgStyle} from '@angular/common';
import {CartService} from './cart.service';
import {CartItem} from './cart-item.model';
import {AuthService} from 'src/app/auth/auth.service';
import {forkJoin, Observable} from 'rxjs';
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {MatDivider} from "@angular/material/divider";
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatCardTitle} from "@angular/material/card";
import {FieldToTextPipe} from "../../../pipes/field-to-text";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../../../dialogs/dialog/dialog-data.model";
import {DialogComponent} from "../../../dialogs/dialog/dialog.component";
import {NgForm} from "@angular/forms";
import {PurchaseData} from "../../../auth/purchase-data.model";
import {OrdersService} from "../../../order-page/orders.service";
import {OrderReq} from "../../../order-page/order-req.model";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [ItemBarComponent, AsyncPipe, NgStyle, MatCheckbox, MatDivider, MatExpansionPanel, MatCardTitle, MatExpansionPanelHeader, FieldToTextPipe, CurrencyPipe, MatButton, MatProgressSpinner, MatIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {
  cartItems: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  selectedIds: Set<string> = new Set<string>();
  totalCost: WritableSignal<number> = signal(0);
  isLoading: WritableSignal<boolean> = signal(true);
  itemCheckboxes: Signal<readonly MatCheckbox[]> = viewChildren<MatCheckbox>('itemCheckbox');

  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    public authService: AuthService,
    public ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  onSelectAll(event: MatCheckboxChange) {
    this.itemCheckboxes().forEach((i: MatCheckbox) => {
      i.writeValue(event.checked);
    });
    this.totalCost.set(0);
    if (event.checked) {
      this.cartItems().forEach(i => {
        this.selectedIds.add(i.itemId)
        this.onItemSelect(i, event.checked);
      });
    } else {
      this.selectedIds = new Set<string>();
    }
  }

  onItemSelect(item: CartItem, isChecked: boolean) {
    this.selectedIds[isChecked ? 'add' : 'delete'](item.id);
    this.totalCost.update(totalCost => totalCost + (item.itemPriceAfterDiscount * item.quantity * (isChecked ? 1 : -1)));
  }

  onDeleteItems() {
    this.isLoading.set(true);
    const removeEntries$: Observable<Object>[] = [];
    this.selectedIds.forEach(entryId => removeEntries$.push(this.cartService.removeEntry(entryId)));
    forkJoin(removeEntries$).subscribe({
      next: () => {
        this.selectedIds.clear();
        this.loadItems();
      },
      error: () => {
        const dialogData: DialogData = {
          title: 'Something went wrong',
          description: 'Elements from cart have not deleted',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
        this.loadItems();
      }
    })
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
    if (!this.authService.user()) {
      const dialogData: DialogData = {
        title: 'Cannot buy',
        description: 'You have to be registered',
        buttonName: 'Ok'
      }
      this.dialog.open(DialogComponent, {data: dialogData});
      return;
    }
    let order: OrderReq = {
      itemEntries: this.cartItems()
        .filter(cItem => this.selectedIds.has(cItem.itemId))
        .map(cItem => ({
          itemId: cItem.itemId,
          quantity: cItem.quantity,
          size: cItem.itemSize
        }))
    }
    this.ordersService.createOrder(order).subscribe(() => {
      const dialogData: DialogData = {
        title: 'Order created!',
        description: 'You will get a notification on email',
        buttonName: 'Ok'
      }
      this.dialog.open(DialogComponent, {data: dialogData});
    });
  }

  private loadItems() {
    this.isLoading.set(true);

    this.cartService.getItems().subscribe(loadedItems => {
      this.cartItems.set(loadedItems);
      this.isLoading.set(false);
    })
  }

  protected readonly Object = Object;
}
