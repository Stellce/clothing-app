import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {LocalService} from 'src/app/local/local.service';
import {CartService} from 'src/app/navigation/navbar/cart/cart.service';
import {FavoritesService} from 'src/app/navigation/navbar/favorites/favorites.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  title: string = 'Activating account...';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private localService: LocalService,
    private favoritesService: FavoritesService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.router.navigate(['/', 'account']);
    this.authService.activateAccount(this.route.snapshot.queryParamMap.get('token')).subscribe({
      next: res => {
        this.title = 'Activation success! You will be redirected in a second';
        setTimeout(() => this.router.navigate(['/', 'account']), 1000);
        this.uploadCart();
        this.uploadFavorites();
      },
      error: () => this.title = 'Activation link is wrong or expired'
    });
  }

  private uploadFavorites() {
    let itemIds = this.localService.favoritesIds;
    let favoriteItemsAdded$ = itemIds.map(id => this.favoritesService.addItem(id));
    forkJoin(favoriteItemsAdded$).subscribe(res => console.log(res));
  }

  private uploadCart() {
    let cart = this.localService.cartItems;
    let cartItemsAdded$ = cart.map(item => this.cartService.addItem({
      itemId: item.itemId,
      quantity: item.quantity,
      size: item.itemSize
    }));
    forkJoin(cartItemsAdded$).subscribe(res => console.log(res));
  }
}
