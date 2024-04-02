import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-scroll-pane',
  templateUrl: './scroll-pane.component.html',
  styleUrls: ['./scroll-pane.component.scss']
})
export class ScrollPaneComponent implements AfterViewChecked{
  @ViewChild('elements') elements: ElementRef;

  ngAfterViewChecked() {
    // this.elements.nativeElement.scrollLeft += 100;
  }

  toLeft() {
    console.log('asdsa');
    this.elements.nativeElement.scrollLeft += 100;
  }
}
