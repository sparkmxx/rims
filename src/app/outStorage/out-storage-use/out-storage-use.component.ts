
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { NzTableComponent, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { NzTreeNode } from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {
  OrganizationUnitDto,
  MaterialStockServiceProxy,PagedResultDtoOfGetMaterialStockPaginationOutput,GetMaterialStockPaginationOutput,MaterialOutStorageServiceProxy,CreateOrUpdateMaterialOutStorageInput,CreateOrUpdateMaterialOutStorageDetailInput
} from '@shared/service-proxies/service-proxies';

import {MaterialScanComponent} from '../../common/material-scan/material-scan.component';
import {QueryConditionDTO} from '@shared/customDTO';
@Component({
  selector: 'app-out-storage-use',
  templateUrl: './out-storage-use.component.html',
  styleUrls: ['./out-storage-use.component.less']
})
export class OutStorageUseComponent extends PagedListingComponentBase<GetMaterialStockPaginationOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  @ViewChild('materialScanModal') materialScanComponent: MaterialScanComponent;
  private destroy$ = new Subject();
  listOfData: GetMaterialStockPaginationOutput[] = [];
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  organizationUnits: OrganizationUnitDto[] = [];
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  applys=[];
  queryDTO:QueryConditionDTO=new QueryConditionDTO();
 
  constructor(private injector: Injector,
    private materialStockServiceProxy: MaterialStockServiceProxy,
    private materialOutStorageServiceProxy: MaterialOutStorageServiceProxy,
    private messageService: NzMessageService,
    private datePipe:DatePipe
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  ngOnInit(): void {
    this.refresh(true);
    this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
    
  }



  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.materialStockServiceProxy.getMaterialStocks(undefined,  this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfGetMaterialStockPaginationOutput) => {
        if (this.pageNumber === 1) {
          this.listOfData = result.items;
        } else {
          this.listOfData = [...this.listOfData, ...result.items];
        }
        this.showPaging(result, pageNumber);
        this.mapOfCheckedId = {};
      });
  }

  ngAfterViewInit(): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (this.pageNumber < this.totalPages && data < this.listOfData.length && data > this.listOfData.length - 5) {
          this.pageNumber++;
          this.getDataPage(this.pageNumber);
        }
      });
  }
  outStorage(): void {
   
    const input = new CreateOrUpdateMaterialOutStorageInput();
    input.outStorageUserId=this.appSession.userId;
    input.organizationId=this.appSession.user.organizationUnitId;
    input.organizationName=this.appSession.user.organizationUnitName;

    input.materialOutStorageDetails=this.applys.map((d)=>{
      const detailDto = new CreateOrUpdateMaterialOutStorageDetailInput();
      detailDto.init(d);
      detailDto.materialId=d.id;
      detailDto.materialName=d.name;
      detailDto.number=d.actualNumber;
      detailDto.id=undefined;
      return detailDto;
    });
    input.outStorageType=this.enumObject.OutStorageType.Use;
    this.loading = true;
    this.materialOutStorageServiceProxy.createOrUpdateMaterialOutStorage(input)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.applys=[];
        this.messageService.create('success', `出库成功`);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  delete(): void {

  }
  deleteDetail(t: any) {
    this.applys = this.applys.filter(d => d != t);
  }
  clear(): void {
    this.applys = [];
  }
  confirmAdd(): void {
    for (let key in this.mapOfCheckedId) {
     
      if (this.mapOfCheckedId[key]) {
        const record = this.listOfData.find(d => d.id === key);
        const t = this.applys.find(d => d.id === record.materialId&&d.batchNo==record.batchNo&&this.datePipe.transform(d.expiryDate,'yyyy-MM-dd')===this.datePipe.transform(record.expiryDate,'yyyy-MM-dd'));
        if (!t) {
          let b={};
          b=Object.assign(b,record.material,record);
          b['id']=record.materialId;
          console.log(b);
          this.applys=[...this.applys,b]
        }
      }
    }
  }

  showScan():void{
    this.materialScanComponent.show(this.enumObject.ScanType.OutStorage,this.enumObject.OutInStorageType.Out);
  }
  scanConfirm(materials:any[]):void{
      this.applys=[];
      materials.forEach((a)=>{
        const item=this.applys.find(d=>d.id==a.materialId&&d.batchNo==a.batchNo&&this.datePipe.transform(d.expiryDate,'yyyy-MM-dd')===this.datePipe.transform(a.expiryDate,'yyyy-MM-dd'));
        if(item){
            if(item.barcodes.indexOf(a.barcode)<0){
                item.actualNumber++;
                item.deliveryNumber=item.actualNumber;
                item.barcodes.push(a.barcode);
            }
        }else{
            let b={};
            b=Object.assign(b,a.material,a);
            b['actualNumber']=1;
            b['id']=a.materialId;
            
            b['barcodes']=[a.barcode];
            this.applys=[...this.applys,b];
        }
      });
 
  }
}
