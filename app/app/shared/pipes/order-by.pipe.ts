import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {
  transform<T>(array: T[], field: string): T[] {
    if (!array || !field) {
      return array;
    }

    const isDescending = field.startsWith('-');
    const fieldName = isDescending ? field.substring(1) : field;

    return [...array].sort((a: any, b: any) => {
      const aVal = a[fieldName];
      const bVal = b[fieldName];

      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return isDescending ? -comparison : comparison;
    });
  }
}
