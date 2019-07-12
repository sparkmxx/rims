import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatOrganizationUnitId'
})
export class FormatOrganizationUnitIdPipe implements PipeTransform {
    transform(id: number, data: any[], args?: any): any {
        const result = {value: ''};
        id = Number(id);
        if (id) {
            this.getUserOrganizationUnit(id, data, result);
        }
        return result.value ? result.value : '';
    }
    getUserOrganizationUnit(id: number, data: any[], result: any): any {
        data.forEach(d => {
            if (d.id === id) {
                result.value = d.displayName;
                return false;
            } else if (d.children && d.children.length > 0) {
                this.getUserOrganizationUnit(id, d.children, result);
            }
        });
    }
}

