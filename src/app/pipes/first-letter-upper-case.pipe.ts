import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterUpperCase',
  standalone: true
})
export class FirstLetterUpperCasePipe implements PipeTransform {

  transform(value: string): string {
    return value ? value[0].toUpperCase() + value.slice(1) : value;
  }

}
