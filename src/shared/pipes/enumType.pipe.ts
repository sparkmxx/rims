import {Injector, Pipe, PipeTransform} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';

@Pipe({
    name: 'enumType'
})
export class EnumTypePipe extends AppComponentBase implements PipeTransform {


    constructor(injector: Injector) {
        super(injector);
    }

    transform(value: any, enumType: string, args?: any): any {
        if (this.enumArray[enumType]) {
            const result = this.enumArray[enumType].find(d => d.value === value);
            return result ? result.description : '';
        } else {
            return '';
        }
    }

}
