import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { NzTableComponent, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { NzTreeNode } from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {WebSettingService} from '@app/layout/webSettingService';
import {
  OrganizationUnitDto,MaterialPurchaseServiceProxy,WaitingForAcceptanceListInput,PagedResultDtoOfWaitingForAcceptanceListOutput,WaitingForAcceptanceListOutput,
  BarcodePrintRecordServiceProxy,CreateOrUpdateBarcodePrintRecordInput,CreateBarcodePrintRecordsInput,CreateBarcodePrintRecordsOutput
} from '@shared/service-proxies/service-proxies';
import {QueryConditionDTO} from '@shared/customDTO';
@Component({
  selector: 'app-purchase-print',
  templateUrl: './purchase-print.component.html',
  styleUrls: ['./purchase-print.component.less']
})
export class PurchasePrintComponent extends PagedListingComponentBase<WaitingForAcceptanceListOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  private destroy$ = new Subject();
  listOfData: WaitingForAcceptanceListOutput[] = [];
  queryDto = {};
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
  createBarcodePrintRecordsInput:CreateBarcodePrintRecordsInput=new CreateBarcodePrintRecordsInput();
  constructor(private injector: Injector,
    private materialPurchaseServiceProxy: MaterialPurchaseServiceProxy,
    private barcodePrintRecordServiceProxy:BarcodePrintRecordServiceProxy,
    private messageService: NzMessageService,
    private router:Router,
    private webSettingService:WebSettingService
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  ngOnInit(): void {
    this.createBarcodePrintRecordsInput.barcodePrintRecords=[];
    this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
    this.refresh(true);
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
        if (this.pageNumber < this.totalPages && data < this.listOfData.length && data > this.listOfData.length - 8) {
          this.pageNumber++;
          this.getDataPage(this.pageNumber);
        }
      });
  }



  
  print(): void {
    this.loading=true;
    
    this.barcodePrintRecordServiceProxy.createBarcodePrintRecords(this.createBarcodePrintRecordsInput)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result:CreateBarcodePrintRecordsOutput) => {
        result.barcodePrintRecords.forEach(d=>{
          d.barcodeInfos.forEach(t=>{
            this.webSettingService.printService({
              code:t.barcode,
              name:d.materialName,
              batchNo:d.batchNo,
              expiryDate:d.expiryDate,
              material:d.material

          });
          });
        })
        this.messageService.create('success', `打印成功`);
        this.router.navigateByUrl('app/print/records');
        
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  delete(): void {

  }
  deletePrint(t:CreateOrUpdateBarcodePrintRecordInput){
    this.createBarcodePrintRecordsInput.barcodePrintRecords=this.createBarcodePrintRecordsInput.barcodePrintRecords.filter(d=>d!=t);
  }
  clear():void{
    this.createBarcodePrintRecordsInput.barcodePrintRecords=[];
  }
  confirmAdd(): void {
      for(let key in this.mapOfCheckedId){
        if(this.mapOfCheckedId[key]){
          const record=this.listOfData.find(d=>d.id===key);
          const t=this.createBarcodePrintRecordsInput.barcodePrintRecords.find(d=>d.materialId===record.materialId);
          if(!t){
            const input=new CreateOrUpdateBarcodePrintRecordInput();
            input.init(record);
            input['purchaseNumber']=record.number;
            input['unArrivalNumber']=record.number-record.arrivalNumber;
            input['purchaseOrderNo']=record.purchase.purchaseOrderNo;
            input['printUserId']=this.appSession.userId;
            this.createBarcodePrintRecordsInput.barcodePrintRecords=[...this.createBarcodePrintRecordsInput.barcodePrintRecords,input];
          }
        }
      }
  }

 
 
}

