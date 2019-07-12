import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatValueToName'
})
export class FormatValueToNamePipe implements PipeTransform {
    transform(value: any, data: any, args?: any): any {
        // data:{data:any[],valueField:string,nameField:string}
        if (value) {
            const item = data.data.find(d => d[data.valueField] === value);
            return item&&item[data.nameField] ? item[data.nameField] : '';
        } else {
            return '';
        }

    }
}
