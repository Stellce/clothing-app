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
    const result = value.replace(/([a-z])([A-Z])/g, '$1 $2') // Adds a space before uppercase letters.
      .replace(/_/g, ' ') // Replaces underscores with spaces.
      .toLowerCase(); // Converts everything to lowercase
    return result.charAt(0).toUpperCase() + result.slice(1); // Capitalizes the first letter
  }
}
