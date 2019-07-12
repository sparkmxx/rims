import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';

import {
  MaterialRequestServiceProxy,PagedResultDtoOfGetMaterialRequestPaginationOutput,GetMaterialRequestPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-material-request-list',
  templateUrl: './material-request-list.component.html',
  styleUrls: ['./material-request-list.component.less']
})
export class MaterialRequestListComponent extends PagedListingComponentBase<GetMaterialRequestPaginationOutput> {
    data: GetMaterialRequestPaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    mapOfCheckedId: { [key: string]: boolean } = {};

    constructor(private materialRequestServiceProxy: MaterialRequestServiceProxy,
                private injector: Injector,
                ) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.materialRequestServiceProxy.getMaterialRequests(undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialRequestPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.updateExpandDataCache();
                this.showPaging(result, pageNumber);
            });
    }

    updateExpandDataCache(): void {
        this.expandDataCache = {};
        this.data.forEach((item, idx) => {
            const i = idx.toString();
            if (!this.expandDataCache[i]) {
                this.expandDataCache[i] = {
                    expand: false,
                    data: {...item}
                };
            }
        });
    }

    delete(): void {
       
    }
    


    checkAll(value: boolean): void {
      this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    }



    
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

