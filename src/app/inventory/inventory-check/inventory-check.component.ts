
import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef, isTemplateRef } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  MaterialInventoryServiceProxy, GetMaterialInventoryForEditOutput, CreateInventoryRecordInput
  , CreateInventoryRecordDto, CreateInventoryRecordDetailDto, GetInventoryRecordDto, GetInventoryRecordDetailDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { MaterialScanComponent } from '@app/common/material-scan/material-scan.component';
import { MaterialBarcodesComponent } from '@app/common/material-barcodes/material-barcodes.component';
@Component({
  selector: 'app-inventory-check',
  templateUrl: './inventory-check.component.html',
  styleUrls: ['./inventory-check.component.less']
})
export class InventoryCheckComponent extends AppComponentBase implements OnInit {
  data: GetInventoryRecordDto = new GetInventoryRecordDto();
  loading = false;
  filter = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  inventoryId: string;
  createInventoryRecordInput: CreateInventoryRecordInput = new CreateInventoryRecordInput();
  isVisible=false;
  errorInfos:any[]=[];
  currentRecord:GetInventoryRecordDetailDto;
  @ViewChild('materialScanModal') materialScanComponent: MaterialScanComponent;
  @ViewChild('materialBarcodes') materialBarcodes:MaterialBarcodesComponent;

  constructor(private materialInventoryServiceProxy: MaterialInventoryServiceProxy,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private nzMessageService: NzMessageService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    super(injector);

  }

  list(): void {
    this.loading = true;
    this.materialInventoryServiceProxy.getInventoryDetail(this.inventoryId)
      .pipe(finalize(() => {
      }))
      .subscribe((result: GetInventoryRecordDto) => {
        this.loading = false;
        this.data = result;

      });
  }
  scanConfirm(materials: any[]): void {
    this.errorInfos=[];
    materials.forEach((a) => {
      const item = this.data.details.find(d => d.materialId == a.materialId && d.batchNo == a.batchNo && this.datePipe.transform(d.expiryDate, 'yyyy-MM-dd') === this.datePipe.transform(a.expiryDate, 'yyyy-MM-dd'));
      if (item) {
        item.barcodes=item.barcodes || [];
        if (item.barcodes.indexOf(a.barcode) < 0) {
          item.barcodes=[...item.barcodes,a.barcode];
          item.actualNumber=item.barcodes.length;
        } else {
          a.message='该条码号已扫码盘点';
          this.errorInfos=[...this.errorInfos,a];
        }
      } else {
        a.message='盘点单无同批次、效期物料';
        this.errorInfos=[...this.errorInfos,a];

      }
    });
    
    if(this.errorInfos.length>0){
      this.isVisible=true;
    }
  }
  mapParam(): void {
    this.createInventoryRecordInput.inventoryRecord = new CreateInventoryRecordDto();
    this.createInventoryRecordInput.inventoryRecord.materialInventoryId = this.inventoryId;
    this.createInventoryRecordInput.inventoryRecord.inventoryOrderNo = this.data.inventoryOrderNo;
    this.createInventoryRecordInput.inventoryRecord.inventoryUserId = this.appSession.userId;
    this.createInventoryRecordInput.inventoryRecord.id=this.data.inventoryRecordId;
    this.createInventoryRecordInput.inventoryRecord.inventoryRecordDetails = this.data.details.map((d) => {
      let b = new CreateInventoryRecordDetailDto();
      b.init(d);
      b.id = undefined;
      console.log(b);
      return b;
    })
  }
  barcodesConfirm(barcodes:string[]):void{
    this.currentRecord.barcodes=[...barcodes];
    this.currentRecord.actualNumber=this.currentRecord.barcodes.length;
  }
  createInventoryRecord(): void {
    this.loading = true;
    this.mapParam();
    this.materialInventoryServiceProxy.createInventoryRecord(this.createInventoryRecordInput)
      .pipe(finalize(() => {
        this.loading=false;
      }))
      .subscribe(() => {
        this.nzMessageService.create('success', '保存成功');
        this.back();
      });
  }
  finishedInventoryRecord(): void {
    this.loading = true;
    this.mapParam();
    this.createInventoryRecordInput.inventoryRecord.isFinished=true;
    this.materialInventoryServiceProxy.finishedInventoryRecord(this.createInventoryRecordInput)
      .pipe(finalize(() => {
        this.loading=false;
      }))
      .subscribe(() => {
        this.nzMessageService.create('success', '盘点成功');
        this.router.navigateByUrl('/app/inventory/list');
      });
  }
  ngOnInit() {
    this.data.details = [];
    this.activatedRoute.params.subscribe(params => {
      this.inventoryId = params['id'];
      this.list();
    });
  }

  delete(): void {

  }

  back(): void {
    this.router.navigateByUrl('/app/inventory/waiting')
  }

  showScan(): void {
    this.materialScanComponent.show(this.enumObject.ScanType.Inventory, this.enumObject.ScanType.Inventory);
  }
  handleCancel():void{
    this.isVisible=false;
  }

  showBarcodes(item:GetInventoryRecordDetailDto):void{
    this.currentRecord=item;
    this.materialBarcodes.showBarcodes(item.barcodes,true);
  }

}

