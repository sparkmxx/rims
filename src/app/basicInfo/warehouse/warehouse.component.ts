import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  WarehouseInfoServiceProxy,PagedResultDtoOfGetWarehouseInfoPaginationOutput,GetWarehouseInfoPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {WarehouseEditComponent} from './warehouse-edit/warehouse-edit.component';
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.less']
})
export class WarehouseComponent extends PagedListingComponentBase<GetWarehouseInfoPaginationOutput> {

    @ViewChild('warehouseEditModal') warehouseEditModal: WarehouseEditComponent;
    data: GetWarehouseInfoPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    constructor(private warehouseInfoServiceProxy: WarehouseInfoServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.warehouseInfoServiceProxy.getWarehouseInfos(this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetWarehouseInfoPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(dto: GetWarehouseInfoPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.warehouseInfoServiceProxy.deleteWarehouseInfo(dto.id)
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
        this.warehouseEditModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
