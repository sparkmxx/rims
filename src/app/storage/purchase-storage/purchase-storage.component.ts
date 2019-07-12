
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
  MaterialStorageServiceProxy,CreateOrUpdateMaterialStorageInput,CreateOrUpdateMaterialStorageDetailDto,
  OrganizationUnitDto,MaterialPurchaseServiceProxy,WaitingForAcceptanceListInput,PagedResultDtoOfWaitingForAcceptanceListOutput,WaitingForAcceptanceListOutput
} from '@shared/service-proxies/service-proxies';
import {QueryConditionDTO,StorageBatchWriteDTO} from '@shared/customDTO';
import {MaterialScanComponent} from '../../common/material-scan/material-scan.component';
@Component({
  selector: 'app-purchase-storage',
  templateUrl: './purchase-storage.component.html',
  styleUrls: ['./purchase-storage.component.less']
})
export class PurchaseStorageComponent extends PagedListingComponentBase<WaitingForAcceptanceListOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  @ViewChild('materialScanModal') materialScanComponent: MaterialScanComponent;
  private destroy$ = new Subject();
  listOfData: WaitingForAcceptanceListOutput[] = [];

  filter = '';
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  organizationUnits: OrganizationUnitDto[] = [];
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  dicts={};
  brands=[];
  applys=[];
  waitingForAcceptanceListInput:WaitingForAcceptanceListInput=new WaitingForAcceptanceListInput();
  queryDTO:QueryConditionDTO=new QueryConditionDTO();
  storageBatchWriteDTO:StorageBatchWriteDTO=new StorageBatchWriteDTO();
  batchState=false;
  constructor(private injector: Injector,
    private materialPurchaseServiceProxy: MaterialPurchaseServiceProxy,
    private materialStorageServiceProxy: MaterialStorageServiceProxy,
    private messageService: NzMessageService,
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

  toggleWrite():void{
    this.batchState=!this.batchState;
  }
  cancelWrite():void{
    this.batchState=false;
  }
  confirmWrite():void{
    console.log(this.storageBatchWriteDTO);
  //this.batchState=false;
    this.applys.forEach(d=>{
      Object.assign(d,this.storageBatchWriteDTO);
    });
    this.messageService.create('success',`填写成功`)
  }
  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.waitingForAcceptanceListInput.init(this.queryDTO);
    this.waitingForAcceptanceListInput.skipCount=request.skipCount;
    this.waitingForAcceptanceListInput.maxResultCount=request.maxResultCount;
    
    this.materialPurchaseServiceProxy.waitingForAcceptanceList(this.waitingForAcceptanceListInput)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfWaitingForAcceptanceListOutput) => {
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
        //console.log('scroll index to', data);
        if (this.pageNumber < this.totalPages && data < this.listOfData.length && data > this.listOfData.length - 8) {
          this.pageNumber++;
          this.getDataPage(this.pageNumber);
        }
      });
  }
  storage(): void {
   
    const input = new CreateOrUpdateMaterialStorageInput();
    input.storageUserId=this.appSession.userId;
    input.organizationId=this.appSession.user.organizationUnitId;
    input.organizationName=this.appSession.user.organizationUnitName;
    input.materialStorageDetails=this.applys.map((d)=>{
      const detailDto = new CreateOrUpdateMaterialStorageDetailDto();
      detailDto.init(d);
      detailDto.materialId=d.id;
      detailDto.materialName=d.name;
      detailDto.id=undefined;
      return detailDto;
    });
    input.storageType=this.enumObject.StorageType.Purchase;
    this.loading = true;
    this.materialStorageServiceProxy.createOrUpdateMaterialStorage(input)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.applys=[];
        this.messageService.create('success', `入库成功`);
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
        const t = this.applys.find(d => d.id === key);
        if (!t) {
          const record = this.listOfData.find(d => d.materialId === key);
          let b={};
          b=Object.assign(b,record,record.material);
          this.applys=[...this.applys,b]
        }
      }
    }
  }

  showScan():void{
    this.materialScanComponent.show(this.enumObject.ScanType.PurchaseStorage,this.enumObject.OutInStorageType.In);
  }
  scanConfirm(materials:any[]):void{
      
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
            b['purchase']=a.materialPurchase;
            this.applys=[...this.applys,b];
        }
      });
 
  }
}
