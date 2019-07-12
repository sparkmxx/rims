
import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';

import {
  PerformanceVerificationReportServiceProxy,PagedResultDtoOfGetPerformanceVerificationReportPaginationOutput,GetPerformanceVerificationReportPaginationOutput
  
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';

@Component({
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.less']
})
export class VerificationListComponent extends PagedListingComponentBase<GetPerformanceVerificationReportPaginationOutput> {
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    data: GetPerformanceVerificationReportPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private performanceVerificationReportServiceProxy: PerformanceVerificationReportServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService
                ) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        
        this.performanceVerificationReportServiceProxy.getPerformanceVerificationReports(undefined,undefined,undefined,undefined,undefined,undefined,undefined,'', this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetPerformanceVerificationReportPaginationOutput) => {
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }

   
    delete(): void {
        
    }
    clearParam():void{
        this.queryDTO= new QueryConditionDTO();
    }
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
