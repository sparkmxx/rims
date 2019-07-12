import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  MaterialInventoryServiceProxy,PagedResultDtoOfGetInventoryRecordPaginationOutput,GetInventoryRecordPaginationOutput,EntityDtoOfGuid
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {QueryConditionDTO} from '@shared/customDTO';
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.less']
})
export class InventoryListComponent extends PagedListingComponentBase<GetInventoryRecordPaginationOutput> {

    data: GetInventoryRecordPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialInventoryServiceProxy: MaterialInventoryServiceProxy,
                private injector: Injector) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.materialInventoryServiceProxy.getInventoryRecords(undefined,undefined,  this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetInventoryRecordPaginationOutput) => {
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    clearParam():void{
        this.queryDTO= new QueryConditionDTO();
        this.refresh();
    }
    inventoryOutOrStorage(id:string):void{
        let dto= new EntityDtoOfGuid();
        dto.id=id;
        this.materialInventoryServiceProxy.inventoryOutOrStorage(dto).subscribe(()=>{
            this.nzMessage.success('盘平成功');
            this.refresh();
        });
    }
    delete(): void {
        
    }

    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
