import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGroup'
})
export class FilterGroupPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      let group = filter.group;
      if ( !group){
        return true;
      }
      if (item.group === group){
        return true;
      }else{
        return false;
      }
    });
  }

}
