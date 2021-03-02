import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupsum'
})
export class GroupsumPipe implements PipeTransform {

  transform(value: any[], order = '', column: string = ''): any[] {
    return null;
  }

}
