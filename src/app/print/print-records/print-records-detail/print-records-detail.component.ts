
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  BarcodePrintRecordServiceProxy, GetBarcodesOutput, BarcodeInfo, GetBarcodePrintRecordPaginationOutput
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import {WebSettingService} from '@app/layout/webSettingService';
@Component({
  selector: 'app-print-records-detail',
  templateUrl: './print-records-detail.component.html',
  styleUrls: ['./print-records-detail.component.less']
})
export class PrintRecordsDetailComponent extends AppComponentBase implements OnInit {
  isVisible = false;
  loading = false;
  data: BarcodeInfo[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  material: GetBarcodePrintRecordPaginationOutput;
  constructor(private barcodePrintRecordServiceProxy: BarcodePrintRecordServiceProxy,
    private injector: Injector,
    private messageService: NzMessageService,
    private webSettingService:WebSettingService
  ) {
    super(injector);
  }
  ngOnInit() {

  }

  show(dto: GetBarcodePrintRecordPaginationOutput): void {
    this.loading = true;
    this.material = dto;
    this.barcodePrintRecordServiceProxy.getBarcodes(dto.id)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result: GetBarcodesOutput) => {
        this.data = result.barcodeInfos;
      });
    this.isVisible = true;
  }



  checkAll(value: boolean): void {
    this.data.forEach(item => (this.mapOfCheckedId[item.barcode] = value));
  }

  save(): void {
     for(let key in this.mapOfCheckedId){
       if(this.mapOfCheckedId[key]){
         this.webSettingService.printService({
          code:key,
          name:this.material.materialName,
          batchNo:this.material.batchNo,
          expiryDate:this.material.expiryDate,
          material:this.material.material
      });
       }
     }
  }

  close(): void {
    this.isVisible = false;
  }

}
