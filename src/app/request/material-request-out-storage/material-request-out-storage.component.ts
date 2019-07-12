import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { NzTableComponent, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { NzTreeNode } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { MaterialBarcodesComponent } from '@app/common/material-barcodes/material-barcodes.component';
import {
  OrganizationUnitDto, MaterialRequestServiceProxy, PagedResultDtoOfGetMaterialRequestPaginationOutput, GetMaterialRequestPaginationOutput,
  MaterialOutStorageServiceProxy, CreateOrUpdateMaterialOutStorageInput, CreateOrUpdateMaterialOutStorageDetailInput,
  RequestOutStorageInput, WaitingForAcceptanceRequestListInput, PagedResultDtoOfWaitingForAcceptanceRequestListOutput, RequestOutStorageDetailInput,
  WaitingForAcceptanceRequestListOutput
} from '@shared/service-proxies/service-proxies';

import { MaterialScanComponent } from '../../common/material-scan/material-scan.component';
import { QueryConditionDTO } from '@shared/customDTO';

@Component({
  selector: 'app-material-request-out-storage',
  templateUrl: './material-request-out-storage.component.html',
  styleUrls: ['./material-request-out-storage.component.less']
})
export class MaterialRequestOutStorageComponent extends PagedListingComponentBase<WaitingForAcceptanceRequestListOutput> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('materialBarcodes') materialBarcodes: MaterialBarcodesComponent;
  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  @ViewChild('materialScanModal') materialScanComponent: MaterialScanComponent;
  private destroy$ = new Subject();
  listOfData: WaitingForAcceptanceRequestListOutput[] = [];
  currentRecord: RequestOutStorageDetailInput;
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  organizationUnits: OrganizationUnitDto[] = [];
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  applys = [];
  queryDTO: QueryConditionDTO = new QueryConditionDTO();
  waitingForAcceptanceRequestListInput: WaitingForAcceptanceRequestListInput = new WaitingForAcceptanceRequestListInput();
  errorInfos = [];
  isVisible = false;
  saveDto :  RequestOutStorageInput;
  constructor(private injector: Injector,
    private materialRequestServiceProxy: MaterialRequestServiceProxy,
    private materialOutStorageServiceProxy: MaterialOutStorageServiceProxy,
    private messageService: NzMessageService,
    private datePipe: DatePipe
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  ngOnInit(): void {
    
    this.queryDTO.organizationId = this.appSession.user.organizationUnitId;
    this.refresh(true);
  }



  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.waitingForAcceptanceRequestListInput.init(this.queryDTO);
    this.waitingForAcceptanceRequestListInput.maxResultCount = request.maxResultCount;
    this.waitingForAcceptanceRequestListInput.skipCount = request.skipCount;
    this.materialRequestServiceProxy.waitingForAcceptanceRequestList(this.waitingForAcceptanceRequestListInput)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfWaitingForAcceptanceRequestListOutput) => {
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
  outStorage(): void {
    this.saveDto = new RequestOutStorageInput();

    this.saveDto.organizationId = this.appSession.user.organizationUnitId;
    this.saveDto.organizationName = this.appSession.user.organizationUnitName;

    this.saveDto.materialOutStorageDetails = this.applys.map((d) => {
      const detailDto = new RequestOutStorageDetailInput();
      detailDto.init(d);
      detailDto.number = d.outNumber;
      return detailDto;
    });
    this.loading = true;
    this.materialRequestServiceProxy.requestOutStorage(this.saveDto)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.applys = [];
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
  selectRequest(data: GetMaterialRequestPaginationOutput) {
    console.log(data);
    this.applys = data.materialRequestDetails.map(d => {
      let b = new RequestOutStorageDetailInput();
      b.init(d.material);
      b.init(d);
      b.materialId = d.materialId;
      b['stockNumber']=d.number;
      return b;
    });
  }
  // confirmAdd(): void {
  //   for (let key in this.mapOfCheckedId) {
  //     if (this.mapOfCheckedId[key]) {
  //       const record = this.listOfData.find(d => d.id === key);
  //       const t = this.applys.find(d => d.id === record.materialId);
  //       if (!t) {
  //         let b={};
  //         b=Object.assign(b,record.material,record);
  //         b['id']=record.materialId;
  //         this.applys=[...this.applys,b]
  //       }
  //     }
  //   }
  // }
  barcodesConfirm(barcodes:string[]):void{
    this.currentRecord.barcodes=[...barcodes];
    this.currentRecord.number=this.currentRecord.barcodes.length;
  }
  scanConfirm(materials: any[]): void {
    this.errorInfos = [];
    console.log(materials);
    console.log(this.applys);
    materials.forEach((a) => {
      const item = this.applys.find(d => d.materialId == a.materialId);
      if (item) {
        item.barcodes = item.barcodes || [];
        if (item.barcodes.indexOf(a.barcode) < 0) {
          item.barcodes = [...item.barcodes, a.barcode];
          item.number = item.barcodes.length;
        } else {
          a.message = '该条码号已扫入';
          this.errorInfos = [...this.errorInfos, a];
        }
      } else {
        a.message = '请领单内无此物料信息';
        this.errorInfos = [...this.errorInfos, a];
      }
    });

    if (this.errorInfos.length > 0) {
      this.isVisible = true;
    }
  }
  scan(): void {
    this.materialScanComponent.show(this.enumObject.ScanType.Inventory, this.enumObject.ScanType.Inventory);
  }
  showBarcodes(item: RequestOutStorageDetailInput): void {
    this.currentRecord = item;
    this.materialBarcodes.showBarcodes(item.barcodes, true);
  }
  handleCancel():void{
    this.isVisible=false;
  }

}
