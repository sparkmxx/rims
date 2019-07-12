
import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  InstrumentServiceProxy,PagedResultDtoOfGetInstrumentPaginationOutput,GetInstrumentPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {InstrumentEditComponent} from './instrument-edit/instrument-edit.component';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.less']
})
export class InstrumentComponent extends PagedListingComponentBase<GetInstrumentPaginationOutput> {

    @ViewChild('instrumentEditModal') instrumentEditModal: InstrumentEditComponent;
    data: GetInstrumentPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    constructor(private instrumentServiceProxy: InstrumentServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.instrumentServiceProxy.getInstruments(undefined,undefined,undefined,undefined,this.filter.trim(), '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetInstrumentPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(ins: GetInstrumentPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.instrumentServiceProxy.deleteInstrument(ins.id)
                    .pipe(finalize(() => {
                        this.refresh();
                        this.messageService.create('success', `删除成功`);
                    }))
                    .subscribe(() => {
                    });
            }
        });
    }

    edit(id?:any): void {
        this.instrumentEditModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
