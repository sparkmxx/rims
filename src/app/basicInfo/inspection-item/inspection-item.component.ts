
import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import {
    InspectionItemServiceProxy, PagedResultDtoOfGetInspectionItemPaginationOutput, GetInspectionItemPaginationOutput, DataDictionaryServiceProxy, DataDictionaryDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { InspectionItemEditComponent } from './inspection-item-edit/inspection-item-edit.component';

@Component({
    selector: 'app-inspection-item',
    templateUrl: './inspection-item.component.html',
    styleUrls: ['./inspection-item.component.less']
})
export class InspectionItemComponent extends PagedListingComponentBase<GetInspectionItemPaginationOutput> implements OnInit {

    @ViewChild('inspectionItemEditModal') inspectionItemEditModal: InspectionItemEditComponent;
    data: GetInspectionItemPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    dicts = [];
    constructor(private inspectionItemServiceProxy: InspectionItemServiceProxy,
        private modelService: NzModalService,
        private injector: Injector,
        private dataDictionaryServiceProxy: DataDictionaryServiceProxy,
        private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.inspectionItemServiceProxy.getInspectionItems(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetInspectionItemPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    getDictionary(): void {
        this.dataDictionaryServiceProxy.getDataDictionaryValues([
            this.enumObject.DictType.InspectResultType
        ]).subscribe((result: DataDictionaryDto[]) => {
            result.forEach((d) => {
                this.dicts = d.dataDictionaryDetails.map((d) => {
                    d.value = d.id;
                    return d;
                });

            });
        });
    }
    ngOnInit(): void {
        this.refresh();
        this.getDictionary();
    }

    delete(dto: GetInspectionItemPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.inspectionItemServiceProxy.deleteInspectionItem(dto.id)
                    .pipe(finalize(() => {
                        this.refresh();
                        this.messageService.create('success', `删除成功`);
                    }))
                    .subscribe(() => {
                    });
            }
        });
    }

    edit(id?: any): void {
        this.inspectionItemEditModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
