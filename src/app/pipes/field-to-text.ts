import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fieldToText',
  standalone: true
})
export class FieldToTextPipe implements PipeTransform {

  transform(value: string): string {
    const result = value.replace(/([A-Z])/g, '$1').toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  }

}
