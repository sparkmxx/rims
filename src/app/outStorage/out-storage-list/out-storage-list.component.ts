import {Component, Injector, OnInit, TemplateRef, ViewChild, AfterViewInit} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  MaterialOutStorageServiceProxy,GetMaterialOutStoragePaginationInput,SumQualtityPagedResultDtoOfXGetMaterialOutStoragePaginationOutput,XGetMaterialOutStoragePaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {QueryConditionDTO} from '@shared/customDTO';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';
@Component({
  selector: 'app-out-storage-list',
  templateUrl: './out-storage-list.component.html',
  styleUrls: ['./out-storage-list.component.less']
})
export class OutStorageListComponent extends PagedListingComponentBase<XGetMaterialOutStoragePaginationOutput> implements OnInit {

    data: XGetMaterialOutStoragePaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    getMaterialOutStoragePaginationInput:GetMaterialOutStoragePaginationInput=new GetMaterialOutStoragePaginationInput();
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    sumQualtity=0;
    constructor(private materialOutStorageServiceProxy: MaterialOutStorageServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.getMaterialOutStoragePaginationInput.init(this.queryDTO);
        this.getMaterialOutStoragePaginationInput.maxResultCount=request.maxResultCount;
        this.getMaterialOutStoragePaginationInput.skipCount=request.skipCount;
        this.materialOutStorageServiceProxy.xGetMaterialOutStorages(this.getMaterialOutStoragePaginationInput)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: SumQualtityPagedResultDtoOfXGetMaterialOutStoragePaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.sumQualtity=result.sumQualtity;
                this.showPaging(result, pageNumber);
            });
    }
    ngAfterViewInit():void{
        
    }
    ngOnInit():void{
        //console.log(this.appSession.user.organizationUnitId);
        this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
        this.refresh();
    }
    getBarcodes(item:XGetMaterialOutStoragePaginationOutput):void{     
        this.barcodeInfos.show(item.materialOutStorage.id,item.materialId,item.batchNo,item.expiryDate);
    }
    delete(): void {
        
    }
    clearParam():void{
        this.queryDTO=new QueryConditionDTO();
    }
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
