import {Component} from '@angular/core';
import {ItemsService} from "../item/items.service";
import {ItemsPage} from "../item/response-items.model";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  page: ItemsPage = {number: 0} as ItemsPage;

  constructor(private itemsService: ItemsService) {}

  onChangePage(changePage: number) {
    let pageNumber = this.page.number + changePage;
    let lessThan = pageNumber < 0;
    let greaterThan = changePage > 0 && this.page.last;
    if(lessThan || greaterThan) return;
    this.itemsService.changePage(pageNumber).subscribe(page => {
        this.page = page;
    });
  }
}
