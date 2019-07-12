import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {

    transform(value: any[], fieldName: string, args?: any): any {
        let fieldValue = '';
        value.forEach((d, idx) => {
            if (idx === (value.length - 1)) {
                fieldValue += d[fieldName];
            } else {
                fieldValue += d[fieldName] + ',';
            }
        });
        return fieldValue;
    }

}
