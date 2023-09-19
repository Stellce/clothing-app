import {AfterContentChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit{
  categories = [
    {name: 'shirts', src: false},
    {name: 'trousers', src: ''},
    {name: 'boots', src: ''}
  ]
  gender: string | undefined;
  childGenders: string[] = ['boys', 'girls']

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.url.subscribe(url => {
      this.gender = url[0].path;
    })
    console.log(this.gender);
  }

}
