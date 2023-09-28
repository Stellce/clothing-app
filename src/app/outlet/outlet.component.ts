import {Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit{
  items: any;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getItems().then(data => this.items = data);
  }
}
