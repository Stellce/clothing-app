import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatError} from '@angular/material/form-field';
import {RouterLink} from '@angular/router';
import {CartItem} from 'src/app/navigation/navbar/cart/cart-item.model';
import {ItemsService} from "../../item/items.service";
import {InputQuantityComponent} from "../../item/input-quantity/input-quantity.component";
import {DialogData} from "../../dialogs/dialog/dialog-data.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogs/dialog/dialog.component";

@Component({
  selector: 'app-item-bar',
  templateUrl: './item-bar.component.html',
  styleUrls: ['./item-bar.component.scss'],
  standalone: true,
  imports: [RouterLink, NgStyle, CurrencyPipe, DatePipe, MatMiniFabButton, MatError, InputQuantityComponent]
})
export class ItemBarComponent implements OnInit{
  @Input() cartItem: CartItem;

  constructor(
    private itemsService: ItemsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.itemsService.requestItemImages(this.cartItem.itemId).subscribe({
      next: images => this.cartItem.images = images,
      error: err => {
        const data: DialogData = {
          title: `Error on loading images`,
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    });
  }
}
