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
    private itemsService: ItemsService,
    protected route: ActivatedRoute,
    private cartService: CartService,
    private dialog: MatDialog,
    private ordersService: OrdersService,
    protected authService: AuthService
  ) {
    afterNextRender(() => {
      this.isFromCart = computed(() => window.location.href.includes('cart'));
    })
  }

  ngOnInit() {
    this.requestItem();
  }

  selectImageIndex(i: number) {
    this.selectedImageIndex.set(i);
  }

  setUniqueItem(uniqueItem: UniqueItem) {
    this.selectedUniqueItem.set(uniqueItem);
    if (this.quantity() > uniqueItem.quantity) this.quantity.set(uniqueItem.quantity);
    this.selectedCartItem.set(this.cartItems().find(item => item.itemSize === this.selectedUniqueItem().size));
  }

  addToCart() {
    const successDialogInvoke = () => {
      this.checkIsInCart();
      let dialogData: DialogData = {
        title: 'Item added!',
        description: 'You can check your cart!'
      };
      this.dialog.open(DialogComponent, {data: dialogData});
    }
    if (this.quantity() > this.selectedUniqueItem().quantity) return;

    if (this.authService.user()) {
      this.cartService.addItem({
        itemId: this.item().id,
        quantity: this.quantity(),
        size: this.selectedUniqueItem().size
      }).subscribe({
        next: () => successDialogInvoke(),
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

  orderNow() {
    const createLoadingDialog = () => this.dialog.open(DialogComponent, {data: {title: "Loading", isLoading: true}, disableClose: true});
    let loadingDialog = createLoadingDialog();
    const addOrder = (orderReq: OrderReq) => {
      this.ordersService.createOrder(orderReq).subscribe({
        next: () => {
          const dialogData: DialogData = {
            title: 'Item purchased!',
            description: 'You will get a notification on email',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData}).afterOpened().subscribe({
            next:() => loadingDialog.close()
          });
        },
        error: err => {
          const dialogData: DialogData = {
            title: 'Something went wrong',
            description: 'Could not proceed',
            buttonName: 'Ok'
          }
          this.dialog.open(DialogComponent, {data: dialogData}).afterOpened().subscribe({
            next:() => loadingDialog.close()
          });
          console.error(err);
        }
      });
    }
    let order: OrderReq = {
      itemEntries: [{
        itemId: this.item().id,
        quantity: this.quantity(),
        size: this.selectedUniqueItem().size
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
      dialogRef.afterOpened().subscribe({
        next:() => loadingDialog.close()
      });
      this.dialogSubscription = dialogRef.afterClosed().subscribe(form => {
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

  ngOnDestroy() {
    this.dialogSubscription?.unsubscribe();
  }

  onItemIdCopy() {
    const data: DialogData = {
      title: 'Copied!',
      description: 'Id successfully copied to clipboard'
    }
    this.dialog.open(DialogComponent, {data});
  }

  private checkIsInCart() {
    this.cartService.getItems().subscribe(items => {
      if (!items.length) return;
      this.cartItems.set(items.filter(item => item.itemId === this.item().id))
      if (!this.cartItems.length) return;
      this.selectedCartItem.set(this.cartItems().find(item => item.itemSize === this.selectedUniqueItem().size));
      this.quantity.set(this.selectedCartItem().quantity);
    });
  }

  private requestItem() {
    const itemId = this.route.snapshot.paramMap.get("itemId");
    this.itemsService.requestItemById(itemId).subscribe((item: ItemDetails) => {
      if(!item) return;
      this.item.set(item);
      this.selectedUniqueItem.set(item.uniqueItems.find(i => i.quantity > 0));
      this.item().params = {
        color: this.item().color,
        brand: this.item().brand
      };
      Object.entries(this.item().params).forEach(([key, value]) => {
        this.params.update(params => [...params, {key, value}])
      });
      this.itemsService.requestItemImages(item.id).subscribe((images: Image[]) => {
        this.item().images = images;
      })

      if (this.authService.user()) this.checkIsInCart();
    });
  }

  protected readonly Math = Math;
}
