import {Component, forwardRef, Input} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { NgClass, NgStyle } from '@angular/common';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [FormsModule, NgClass, NgStyle]
})
export class CheckboxComponent implements ControlValueAccessor {

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  checked: boolean = false;
  writeValue(checked: boolean) {
    this.checked = checked;
  }

  onModelChange(e: boolean) {
    // Step 5a: bind the changes to the local value
    this.checked = e;

    // Step 5b: Handle what should happen on the outside, if something changes on the inside
    this.onChange(e);
  }

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
