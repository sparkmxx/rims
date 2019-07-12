import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  BarcodePrintRecordServiceProxy,PagedResultDtoOfGetBarcodePrintRecordPaginationOutput,GetBarcodePrintRecordPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {PrintRecordsDetailComponent} from './print-records-detail/print-records-detail.component';
@Component({
  selector: 'app-print-records',
  templateUrl: './print-records.component.html',
  styleUrls: ['./print-records.component.less']
})
export class PrintRecordsComponent extends PagedListingComponentBase<GetBarcodePrintRecordPaginationOutput> {
    @ViewChild('printRecordsDetailModal') printRecordsDetailModal: PrintRecordsDetailComponent;
    data: GetBarcodePrintRecordPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    constructor(private barcodePrintRecordServiceProxy: BarcodePrintRecordServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.barcodePrintRecordServiceProxy.getBarcodePrintRecords(undefined,undefined,undefined,undefined,undefined,undefined,undefined,this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetBarcodePrintRecordPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(): void {

    }

 
    printAgain(dto:GetBarcodePrintRecordPaginationOutput):void{
        this.printRecordsDetailModal.show(dto);
    }

    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
