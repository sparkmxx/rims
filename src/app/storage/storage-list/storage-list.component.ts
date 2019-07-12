import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';
import {
  XGetMaterialStoragePaginationOutput,
  MaterialStorageServiceProxy,GetMaterialStoragePaginationInput,SumQualtityPagedResultDtoOfXGetMaterialStoragePaginationOutput,
  
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.less']
})
export class StorageListComponent extends PagedListingComponentBase<XGetMaterialStoragePaginationOutput> implements OnInit {
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    data: XGetMaterialStoragePaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    getMaterialStoragePaginationInput:GetMaterialStoragePaginationInput=new GetMaterialStoragePaginationInput();
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialStorageServiceProxy: MaterialStorageServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.getMaterialStoragePaginationInput.init(this.queryDTO);
        this.getMaterialStoragePaginationInput.maxResultCount=request.maxResultCount;
        this.getMaterialStoragePaginationInput.skipCount=request.skipCount;
        this.materialStorageServiceProxy.xGetMaterialStorages(this.getMaterialStoragePaginationInput)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: SumQualtityPagedResultDtoOfXGetMaterialStoragePaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    ngOnInit():void{
        //console.log(this.appSession.user.organizationUnitId);
        this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
        this.refresh();
    }
    getBarcodes(item:XGetMaterialStoragePaginationOutput):void{
        //this.barcodePrintRecordServiceProxy.
        this.barcodeInfos.show(item.materialStorageId,item.materialId,item.batchNo,item.expiryDate);
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
