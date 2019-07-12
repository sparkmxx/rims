import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';
import {
  MaterialOutStorageServiceProxy,PagedResultDtoOfGetMaterialOutStoragePaginationOutput,GetMaterialOutStoragePaginationOutput,EntityDtoOfGuid
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-outstorage-orders',
  templateUrl: './outstorage-orders.component.html',
  styleUrls: ['./outstorage-orders.component.less']
})
export class OutstorageOrdersComponent extends PagedListingComponentBase<GetMaterialOutStoragePaginationOutput> {
    data: GetMaterialOutStoragePaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    mapOfCheckedId: { [key: string]: boolean } = {};
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialOutStorageServiceProxy: MaterialOutStorageServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.materialOutStorageServiceProxy.getMaterialOutStorages(this.queryDTO.startDate,this.queryDTO.endDate,undefined,undefined,undefined,undefined,this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId, undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback();
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialOutStoragePaginationOutput) => {
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
    clearParam():void{
      this.queryDTO=new QueryConditionDTO();
    }


    checkAll(value: boolean): void {
      this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    }


    outStorageSyncK3():void{
      for (let key in this.mapOfCheckedId){
        if(this.mapOfCheckedId[key]){
          const input= new EntityDtoOfGuid();
          input.id=key;
          this.materialOutStorageServiceProxy.syncK3(input)
                .pipe(finalize(() => {
                    this.refresh();
                    this.messageService.create('success', `同步成功`);
                }))
                .subscribe(() => {
                });
        }
      }

    }
    
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

