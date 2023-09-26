import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from "@angular/router";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit{
  url: UrlSegment[];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.url = this.activatedRoute.snapshot.url;
  }

  generateLink(length: number) {
    let link = "";
    for(let i = 0; i<=length; i++) {
      link += '/' + this.url[i].path;
    }
    return link
  }
}
