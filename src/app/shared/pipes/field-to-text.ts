import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fieldToText',
  standalone: true
})
@Injectable({
  providedIn: 'root'
})
export class FieldToTextPipe implements PipeTransform {
  transform(value: string): string {
    const result = value.replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/_/g, ' ')
      .toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
