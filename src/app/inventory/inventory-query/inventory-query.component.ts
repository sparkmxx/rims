import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  MaterialStockServiceProxy,PagedResultDtoOfGetMaterialStockPaginationOutput,GetMaterialStockPaginationOutput,FileDto
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {QueryConditionDTO} from '@shared/customDTO';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';
@Component({
  selector: 'app-inventory-query',
  templateUrl: './inventory-query.component.html',
  styleUrls: ['./inventory-query.component.less']
})
export class InventoryQueryComponent extends PagedListingComponentBase<GetMaterialStockPaginationOutput> {

    data: GetMaterialStockPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    @ViewChild('materialBarcodes') materialBarcodesComponent:MaterialBarcodesComponent
    constructor(private materialStockServiceProxy: MaterialStockServiceProxy,
                private injector: Injector) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.materialStockServiceProxy.getMaterialStocks(undefined,  this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialStockPaginationOutput) => {
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    exportFile():void{
        const req=new PagedRequestDto();
        req.maxResultCount = this.pageSize;
        req.skipCount = (this.pageNumber - 1) * this.pageSize;
        this.materialStockServiceProxy.getMaterialStocksToExcel(undefined,  this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', req.maxResultCount, req.skipCount).subscribe((result:FileDto)=>{
            this.downloadTempFile(result);
            this.nzMessage.create('success','导出成功');
        })
    }
    showBarcodes(item:GetMaterialStockPaginationOutput):void{
        this.materialBarcodesComponent.showInventoryBarcodes(item.materialId,item.batchNo,item.expiryDate);
    }
    clearParam():void{
        this.queryDTO= new QueryConditionDTO();
        this.refresh();
    }
    
    delete(): void {
        
    }

    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
