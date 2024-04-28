import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    const options = {
      weekday: 'long' as const,
      day: '2-digit' as const,
      month: 'long' as const,
      year: 'numeric' as const
    };

    const date = new Date(value);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return date.toLocaleDateString('es-ES', options);
  
  }

}