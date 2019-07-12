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
  MaterialRequestServiceProxy,CreateOrUpdateMaterialRequestInput,CreateOrUpdateMaterialRequestDetailDto,CreateOrUpdateMaterialRequestDto,
  MaterialStockServiceProxy,PagedResultDtoOfGetMaterialStockPaginationOutput,GetMaterialStockPaginationOutput,PagedResultDtoOfGetMaterialStockClassificationOutput,GetMaterialStockClassificationOutput
} from '@shared/service-proxies/service-proxies';

import {MaterialScanComponent} from '../../common/material-scan/material-scan.component';
import {QueryConditionDTO} from '@shared/customDTO';

@Component({
  selector: 'app-material-request',
  templateUrl: './material-request.component.html',
  styleUrls: ['./material-request.component.less']
})
export class MaterialRequestComponent extends PagedListingComponentBase<GetMaterialStockClassificationOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  @ViewChild('materialScanModal') materialScanComponent: MaterialScanComponent;
  private destroy$ = new Subject();
  listOfData: GetMaterialStockClassificationOutput[] = [];
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  applys=[];
  queryDTO:QueryConditionDTO=new QueryConditionDTO();
 
  constructor(private injector: Injector,
    private materialStockServiceProxy: MaterialStockServiceProxy,
    private materialRequestServiceProxy: MaterialRequestServiceProxy,
    private messageService: NzMessageService,
    private formatOrganizationUnitIdPipe:FormatOrganizationUnitIdPipe,
    private datePipe:DatePipe
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  ngOnInit(): void {
    
    this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
    this.refresh(true);
  }



  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.materialId] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.materialStockServiceProxy.getMaterialStockClassification(this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfGetMaterialStockClassificationOutput) => {
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
        if (this.pageNumber < this.totalPages && data < this.listOfData.length && data > this.listOfData.length - 8) {
          this.pageNumber++;
          this.getDataPage(this.pageNumber);
        }
      });
  }
  request(): void {
   
    const input = new CreateOrUpdateMaterialRequestInput();
    input.request=new CreateOrUpdateMaterialRequestDto();
    input.request.applicantUserId=this.appSession.userId.toString();
    input.request.organizationId=this.appSession.user.organizationUnitId;
    input.request.organizationName=this.appSession.user.organizationUnitName;
    input.request.targetOrganizationId=this.queryDTO.organizationId;
    input.request.targetOrganizationName=this.queryDTO.organizationName;
    input.request.materialRequestDetails=this.applys.map((d)=>{
      const detailDto = new CreateOrUpdateMaterialRequestDetailDto();
      detailDto.init(d);
      detailDto.materialId=d.id;
      detailDto.materialName=d.name;
      detailDto.id=undefined;
      return detailDto;
    });
    this.loading = true;
    this.materialRequestServiceProxy.createOrUpdateMaterialRequest(input)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.applys=[];
        this.nzMessage.create('success', `请领成功`);
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
        const record = this.listOfData.find(d => d.materialId === key);
        const t = this.applys.find(d => d.id === record.materialId);
        if (!t) {
          let b={};
          b=Object.assign(b,record,record.material);
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
            b['deliveryNumber']=b['actualNumber'];
            b['barcodes']=[a.barcode];
            this.applys=[...this.applys,b];
        }
      });
 
  }
}
