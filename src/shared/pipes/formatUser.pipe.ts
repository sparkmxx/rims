import {Injector, Pipe, PipeTransform} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';

@Pipe({
    name: 'formatUser'
})
export class FormatUserPipe extends AppComponentBase implements PipeTransform {


    constructor(injector: Injector) {
        super(injector);
    }

    transform(value: any, args?: any): any {
        if (value) {
            console.log(this.webSettings.users);
            console.log('this.webSettings.users');
            const result = this.webSettings.users.find(d=>d.id===value);
            return result ? result.name : '';
        } else {
            return '';
        }
    }

}
