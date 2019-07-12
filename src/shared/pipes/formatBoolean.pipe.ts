import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBoolean'
})
export class FormatBooleanPipe implements PipeTransform {

  transform(value: any, args?: any):string {
     if(value){
       return '是';
     }else{
      return '否';
     }
  }

}
