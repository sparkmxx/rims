import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'arrayFilter'
})
export class ArrayFilter implements PipeTransform {
    transform(value: any[], ...filters): any {
        // filter:{field:string,value:any,fuzzy:boolean}
        value= value.filter(d => filters.length ? filters.every(flt => flt['value'] ? flt['fuzzy'] ? d[flt['field']].indexOf(flt['value']) !== -1 : d[flt['field']] === flt['value'] : true) : true);
        return value;
    }
}
