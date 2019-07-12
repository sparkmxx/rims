
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { NzTableComponent,NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { LodopService, Lodop,LodopConfig } from '@delon/abc';
import {Router} from '@angular/router';
import {WebSettingService} from '@app/layout/webSettingService';
import {
  MaterialServiceProxy, PagedResultDtoOfGetMaterialPaginationOutput, GetMaterialPaginationOutput, BarcodePrintRecordServiceProxy,CreateBarcodePrintRecordsInput,CreateOrUpdateBarcodePrintRecordInput,CreateBarcodePrintRecordsOutput
} from '@shared/service-proxies/service-proxies';
import {QueryConditionDTO} from '@shared/customDTO';
@Component({
  selector: 'app-material-print',
  templateUrl: './material-print.component.html',
  styleUrls: ['./material-print.component.less']
})
export class MaterialPrintComponent extends PagedListingComponentBase<GetMaterialPaginationOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  private destroy$ = new Subject();
  listOfData: GetMaterialPaginationOutput[] = [];
  queryDto = {};
  filter = '';
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  createBarcodePrintRecordsInput:CreateBarcodePrintRecordsInput;
  queryDTO:QueryConditionDTO=new QueryConditionDTO();
  lodop: Lodop | null = null;
  constructor(private injector: Injector, private materialServiceProxy: MaterialServiceProxy,
    private barcodePrintRecordServiceProxy: BarcodePrintRecordServiceProxy,
    private messageService: NzMessageService,
    private lodopService:LodopService,
    private router:Router,
    private webSettingService:WebSettingService
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  ngOnInit(): void {
 
    
    this.createBarcodePrintRecordsInput=new CreateBarcodePrintRecordsInput();
    this.createBarcodePrintRecordsInput.barcodePrintRecords=[];
    this.queryDTO.organizationId=this.appSession.user.organizationUnitId;
    this.refresh(true);
  }

  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.loading = true;
    this.materialServiceProxy.getMaterials(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId, undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfGetMaterialPaginationOutput) => {
        this.loading = false;

        if (this.pageNumber === 1) {
          this.listOfData = result.items;
        } else {
          this.listOfData = [...this.listOfData, ...result.items];
        }
        this.showPaging(result, pageNumber);
        this.mapOfCheckedId={};
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
    //this.printService();
    
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
  // printService(printModel):void{
  //   const LODOP = this.lodop;
    
  //   var org='';
  //   if(printModel.material.isPublicReagent){
  //       org='公共试剂';
  //   }else {
  //       org=printModel.material.organizationMaterials&&printModel.material.organizationMaterials.lenth>0?printModel.material.organizationMaterials[0].organizationName:'';
  //   }
  //   LODOP.PRINT_INIT('预置条码打印');
  //   LODOP.SET_PRINT_STYLE('FontSize', 8);
  //   LODOP.SET_PRINT_STYLE('FontName', '微软雅黑');
  //   LODOP.ADD_PRINT_TEXT('2mm', '2mm', '46mm', '3mm',printModel.name);
  //   LODOP.SET_LICENSES('上海红爵信息科技发展有限公司', '1AD1F3BDC26B8A56138F46683237E0FF', '','');
  //   LODOP.ADD_PRINT_BARCODE('6mm', '2mm', '46mm', '8mm', '128Auto', printModel.code);
  //   LODOP.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
  //   LODOP.SET_PRINT_STYLE('FontSize', 7);
  //   LODOP.ADD_PRINT_TEXT('15mm', '2mm', '50mm', '3mm',printModel.code);
  //   LODOP.ADD_PRINT_TEXT('19mm', '2mm', '50mm', '3mm','效期：'+printModel.expiryDate);
  //   LODOP.ADD_PRINT_TEXT('19mm', '26mm', '50mm', '3mm','部门：'+org);
  //   LODOP.ADD_PRINT_TEXT('23mm', '2mm', '50mm', '3mm','规格：'+printModel.material.specification);
  //   LODOP.ADD_PRINT_TEXT('23mm', '26mm', '50mm', '3mm','存储条件：'+printModel.material.storageConditionName);
  //   LODOP.ADD_PRINT_TEXT('26mm', '2mm', '50mm', '3mm','批次号：'+printModel.batchNo);
  //   LODOP.PRINT();
  // }
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
          const t=this.createBarcodePrintRecordsInput.barcodePrintRecords.find(d=>d.materialId===key);
          if(!t){
            const record=this.listOfData.find(d=>d.id===key);
            const input=new CreateOrUpdateBarcodePrintRecordInput();
            input.materialName=record.name;
            input.materialId=record.id;
            input.hospitalMaterialCode=record.hospitalMaterialCode;
            input['specification']=record.specification;
            this.createBarcodePrintRecordsInput.barcodePrintRecords=[...this.createBarcodePrintRecordsInput.barcodePrintRecords,input];
          }
        }
      }
  }
}
