import {CommonModule} from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component, inject,
  Injector,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {LocalService} from 'src/app/shared/local/local.service';
import {FavoritesService} from 'src/app/tabs/favorites/favorites.service';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-activate',
    imports: [CommonModule],
    templateUrl: './activate.component.html',
    styleUrls: ['./activate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivateComponent implements OnInit {
  title: WritableSignal<string> = signal<string>('Activating account...');
  private injector = inject(Injector);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private localService: LocalService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    afterNextRender(() => {
      this.authService.activateAccount(this.route.snapshot.queryParamMap.get('token')).subscribe({
        next: () => {
          this.title.set('Activation success! You will be redirected in a second');
          setTimeout(() => this.router.navigate(['/', 'account']), 1000);
          this.uploadFavorites();
        },
        error: () => this.title.set('Activation link is wrong or expired')
      });
    }, {injector: this.injector});
  }

  private uploadFavorites() {
    let itemIds = this.localService.favoritesIds;
    let favoriteItemsAdded$ = itemIds.map(id => this.favoritesService.addItem(id));
    forkJoin(favoriteItemsAdded$).subscribe();
  }
}
