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
    const result = value.replace(/([A-Z])/g, '$1').toLowerCase().replace('_', ' ');
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  }
}
