import {CurrencyPipe, NgClass} from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ActivatedRoute, Params} from "@angular/router";
import {AuthService} from '../auth/auth.service';
import {BreadcrumbComponent} from '../categories/list-items/breadcrumb/breadcrumb.component';
import {UniqueItem} from '../categories/list-items/item-card/item-card.model';
import {CartService} from '../tabs/cart/cart.service';
import {FieldToTextPipe} from '../shared/pipes/field-to-text';
import {Image} from "./image.model";
import {ItemDetails} from "./item.model";
import {ItemsService} from "./items.service";
import {ReviewsComponent} from './reviews/reviews.component';
import {AddToFavoritesComponent} from "./add-to-favorites/add-to-favorites.component";
import {MatRipple} from "@angular/material/core";
import {InputQuantityComponent} from "./input-quantity/input-quantity.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {OrdersService} from "../order-page/orders.service";
import {OrderReq} from "../order-page/order-req.model";
import {UpdateCartItemReq} from "../tabs/cart/req/update-cart-req.model";
import {DialogData} from "../shared/dialog/dialog-data.model";
import {CartItem} from "../tabs/cart/cart-item.model";
import {Subscription} from "rxjs";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {PurchaseData} from "../auth/purchase-data.model";
import {PurchaseService} from "./purchase.service";
import {DialogService} from "../shared/dialog/dialog.service";

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss'],
    imports: [BreadcrumbComponent, NgClass, MatButtonModule, ReviewsComponent, CurrencyPipe, MatFormFieldModule, MatInputModule, FormsModule, FieldToTextPipe, AddToFavoritesComponent, MatRipple, InputQuantityComponent, CdkCopyToClipboard],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, OnDestroy {
  item: WritableSignal<ItemDetails> = signal<ItemDetails>(null);
  selectedUniqueItem: WritableSignal<UniqueItem> = signal<UniqueItem>(null);
  quantity: WritableSignal<number> = signal<number>(1);
  params: WritableSignal<Params[]> = signal<Params[]>([]);
  selectedImageIndex: WritableSignal<number> = signal<number>(0);
  cartItems: WritableSignal<CartItem[]> = signal<CartItem[]>([]);
  selectedCartItem: WritableSignal<CartItem> = signal<CartItem>(null);
  dialogSubscription: Subscription;
  quantityDiff: Signal<number> = computed(() => this.quantity() - this.selectedCartItem().quantity);

  isFromCart: Signal<boolean> = signal(false);

  constructor(
    protected route: ActivatedRoute,
    protected authService: AuthService,
    private itemsService: ItemsService,
    private cartService: CartService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private ordersService: OrdersService,
    private purchaseService: PurchaseService,
    private fieldToText: FieldToTextPipe
  ) {
    afterNextRender(() => {
      this.isFromCart = computed(() => window.location.href.includes('cart'));
    })
  }

  ngOnInit() {
    this.requestItem();
  }

  ngOnDestroy() {
    this.dialogSubscription?.unsubscribe();
  }

  protected selectImageIndex(i: number) {
    this.selectedImageIndex.set(i);
  }

  protected setUniqueItem(uniqueItem: UniqueItem) {
    this.selectedUniqueItem.set(uniqueItem);
    if (this.quantity() > uniqueItem.quantity) this.quantity.set(uniqueItem.quantity);
    this.selectedCartItem.set(this.cartItems().find(item => item.itemSize === this.selectedUniqueItem().size));
  }

  protected addToCart() {
    if (this.quantity() > this.selectedUniqueItem().quantity) return;

    if (this.authService.user()) {
      this.cartService.addItem({
        itemId: this.item().id,
        quantity: this.quantity(),
        size: this.selectedUniqueItem().size
      }).subscribe({
        next: () => {
          this.checkIsInCart();
          let dialogData: DialogData = {
            title: 'Item added!',
            description: 'You can check your cart!'
          };
          this.dialog.open(DialogComponent, {data: dialogData});
          this.requestItem();
        },
        error: e => {
          console.error(e);
          const dialogData: DialogData = {
            title: 'Unable to add to cart',
            description: 'Service unavailable. Try again later',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData});
        }
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

  protected orderNow() {
    const loadingDialog = this.dialogService.createLoadingDialog();

    let order: OrderReq = {
      itemEntries: [{
        itemId: this.item().id,
        quantity: this.quantity(),
        size: this.selectedUniqueItem().size
      }]
    };

    if (this.authService.user()) {
      this.ordersService.addOrder(order, loadingDialog);
      return;
    }

    const dialogData: DialogData = {
      title: 'Order details',
      description: 'You are not logged in. Please log in, register, or fill in the following fields.',
      inputs: [
        {name: 'firstName'},
        {name: 'lastName'},
        {name: 'email'},
      ],
      selects: [],
      buttonName: 'Submit',
      note: ''
    }

    for (const propKey in this.purchaseService.purchaseData()) {
      const prop = this.purchaseService.purchaseData()[propKey as keyof PurchaseData];
      if (prop.isEditable) {
        dialogData.inputs.push(
          {name: propKey, defaultValue: prop.value || prop.placeholder, allowEmpty: prop.allowEmpty}
        );
      } else {
        const str = `${this.fieldToText.transform(propKey)}: ${prop.placeholder}\n`;
        dialogData.note += str || '';
      }
    }

    const dialogRef: MatDialogRef<DialogComponent, NgForm> = this.dialog.open(DialogComponent, {data: dialogData});
    dialogRef.afterOpened().subscribe(() => loadingDialog.close());
    this.dialogSubscription = dialogRef.afterClosed().subscribe({
      next: form => {
        if (!form || !form?.value || !form?.valid) return;
        order = {...order, customer: {...form.value}}
        this.ordersService.addOrder(order);
        this.requestItem();
      }, error: console.log
    });
  }

  protected sizeString(size: string): string {
    const split = size.split("X");
    const splitNoEmpty = split.filter(Boolean).toString();
    const numOfXes = split.length - splitNoEmpty.length;
    return size.length > 2 ? numOfXes + "X" + splitNoEmpty : size;
  }

  protected onSaveCartItem() {
    const success = () => {
      this.checkIsInCart();
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
      entryId: this.selectedCartItem().id,
      quantity: this.quantity(),
      size: this.selectedUniqueItem().size
    }
    this.cartService.updateItem(cartItem).subscribe({
      next: success,
      error: failure
    });
  }

  protected onItemIdCopy() {
    const data: DialogData = {
      title: 'Copied!',
      description: 'Id successfully copied to clipboard'
    }
    this.dialog.open(DialogComponent, {data});
  }

  private checkIsInCart() {
    this.cartService.getItems().subscribe(items => {
      if (!items.length) return;
      this.cartItems.set(items.filter(item => item.itemId === this.item()?.id));
      if (!this.cartItems().length) return;
      const selectedItem = this.cartItems().find(item => item.itemSize === this.selectedUniqueItem().size);
      this.selectedCartItem.set(selectedItem);
      this.quantity.set(selectedItem?.quantity);
    });
  }

  private requestItem() {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    if (!itemId) return;
    this.item.set(null);
    this.params.set([]);
    this.itemsService.requestItemById(itemId).subscribe((item: ItemDetails) => {
      if(!item) return;
      this.item.set(item);
      this.selectedUniqueItem.set(item.uniqueItems.find(i => i.quantity > 0));
      this.item.update(item => ({
        ...item, params: {
          color: this.item().color,
          brand: this.item().brand
        }
      }));
      Object.entries(this.item().params).forEach(([key, value]) => {
        this.params.update(params => [...params, {key, value}])
      });
      this.itemsService.requestItemImages(item.id).subscribe((images: Image[]) => {
        this.item.update(item => ({...item, images}));
      })

      if (this.authService.user()) this.checkIsInCart();
    });
  }

  protected readonly Math = Math;
}
