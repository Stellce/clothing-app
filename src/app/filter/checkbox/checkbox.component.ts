import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
  @Input('text') itemText: string;
  @Input('bgColor') bgColor: string;

  @Input('inputName') inputName: string;
  @Input('inputValue') inputValue: string;

  darkColors = ['black', 'red', 'green', 'blue', 'multi', 'grey', 'violet']


  getColorOfColorFilter(color: string) {
    let gradient = 'linear-gradient(33deg, rgba(255,0,228,1) 0%, rgba(0,211,255,1) 100%)';
    if (color === 'multi') return gradient;
    if (color === 'violet') return 'darkviolet';
    return color;
  }
}
