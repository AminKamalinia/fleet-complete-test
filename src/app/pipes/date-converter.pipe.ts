import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateConverter'
})
export class DateConverterPipe implements PipeTransform {

  transform(value: moment.Moment): string {
    if (value !== null && value !== undefined) {
      return moment(value).fromNow();
    } else {
      return '';
    }
  }
}
