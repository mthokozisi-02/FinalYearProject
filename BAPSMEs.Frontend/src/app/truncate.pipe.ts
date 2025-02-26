import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: false
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, wordLimit: number = 3): string {
    if (!value) return '';
    const words = value.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : value;
  }
}
