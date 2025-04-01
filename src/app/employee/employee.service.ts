import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CreateItem, ItemDetails} from "../item/item.model";
import {tap} from "rxjs";
import {DialogData} from "../shared/dialog/dialog-data.model";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  addToLandingPage(ids: string) {
    let params = {ids};
    return this.http.post(environment.backendUrl + '/catalog/items/landing-page', {}, {params}).pipe(tap({
      next: () => {
        const data: DialogData = {
          title: 'Items added',
          description: 'Items were successfully added to landing page',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data});
      },
      error: err => {
        const data: DialogData = {
          title: 'Error',
          description: `Could not add items. ${err['status'] ? `Error ${err['status']} occurred` : ''}`,
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data});
      }
    }));
  }

  deleteFromLandingPage(ids: string) {
    let params = {ids};
    return this.http.delete(environment.backendUrl + '/catalog/items/landing-page', {params}).pipe(tap({
      next: () => {
        const dialogData: DialogData = {
          title: 'Items added',
          description: 'Items were successfully deleted to landing page',
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      },
      error: err => {
        const dialogData: DialogData = {
          title: 'Error',
          description: `Could not delete items. ${err['status'] ? `Error ${err['status']} occurred` : ''}`,
          buttonName: 'Ok'
        }
        this.dialog.open(DialogComponent, {data: dialogData});
      }
    }));
  }

  createItem(item: CreateItem) {
    return this.http.post<ItemDetails>(environment.backendUrl + '/catalog/items', item).pipe(tap({
      next: () => {
        const data: DialogData = {
          title: 'Done',
          description: 'Item have been added'
        }
        this.dialog.open(DialogComponent, {data});
      },
      error: err => {
        const data: DialogData = {
          title: 'Cannot add item',
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    }));
  }

  updateItem(itemId: string, item: CreateItem) {
    return this.http.put<ItemDetails>(environment.backendUrl + '/catalog/items/' + itemId, item).pipe(tap({
      next: () => {
        const data: DialogData = {
          title: 'Item updated'
        }
        this.dialog.open(DialogComponent, {data});
      },
      error: err => {
        const data: DialogData = {
          title: 'Cannot update item',
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    }));
  }

  deleteItem(itemId: string) {
    return this.http.delete(environment.backendUrl + '/catalog/items?itemId=' + itemId).pipe(tap({
      next: () => {
        const data: DialogData = {
          title: 'Done',
          description: 'Item successfully deleted'
        }
        this.dialog.open(DialogComponent, {data});
      },
      error: err => {
        const data: DialogData = {
          title: 'Unable to delete item',
          description: `${err['status'] ? `Error ${err['status']} occurred` : ''}`
        }
        this.dialog.open(DialogComponent, {data});
      }
    }));
  }

  uploadItemImages(itemId: string, images: File[]) {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    return this.http.post(
      environment.backendUrl + `/catalog/items/${itemId}/images`,
      formData
    )
  }

  deleteItemImages(itemId: string, imagesIds: string) {
    const params = new HttpParams().set('ids', imagesIds);
    return this.http.delete(
      environment.backendUrl + `/catalog/items/${itemId}/images`,
      {params}
    )
  }
}
