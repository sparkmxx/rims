import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  BarcodePrintRecordServiceProxy, ValidateBarcodeOutput, ValidateBarcodeInput, GetBarcodeInfoOutput, MaterialOutStorageServiceProxy,
  ValidateMaterialExpiryDateOutput, ValidateMaterialExpiryDateInput
} from '@shared/service-proxies/service-proxies';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-material-scan',
  templateUrl: './material-scan.component.html',
  styleUrls: ['./material-scan.component.less']
})
export class MaterialScanComponent extends AppComponentBase implements OnInit, AfterViewInit {
  isVisible = false;
  isConfirmLoading = false;
  data = [];
  validateBarcodeInput: ValidateBarcodeInput;
  scaning = false;
  outStorageType: number;
  scanType: number;
  barcode = '';
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("barcodeInput") scanInputElement: ElementRef;

  constructor(private barcodePrintRecordServiceProxy: BarcodePrintRecordServiceProxy,
    private injector: Injector,
    private materialOutStorageServiceProxy: MaterialOutStorageServiceProxy,
    private messageService: NzMessageService,
    private nzModalService: NzModalService
  ) {
    super(injector);
  }

  scan(e): void {

    if (e.keyCode !== 13) {
      return;
    }
    this.scaning = true;
    this.validateBarcodeInput.barcode = this.barcode;
    if (this.scanType === this.enumObject.ScanType.Inventory) {
      this.getBrcodeInfo();
    } else {
      this.barcodePrintRecordServiceProxy.validateBarcode(this.validateBarcodeInput).pipe(finalize(() => {

      })).subscribe((a: ValidateBarcodeOutput) => {
        if (a.success) {
          this.getBrcodeInfo();
        } else {
          this.scaning = false;
          if (this.scanType === this.enumObject.ScanType.OutStorage) {
            this.messageService.error('已经出库');
          } else if (this.scanType === this.enumObject.ScanType.OtherStorage) {
            this.messageService.error('已经入库');
          }

        }
      });
    }

  }

  getBrcodeInfo(): void {
    this.barcodePrintRecordServiceProxy.getBarcodeInfo(this.barcode, this.scanType).pipe(finalize(() => {
      this.scaning = false;
    })).subscribe((result: GetBarcodeInfoOutput) => {
      result['barcode'] = this.barcode;
      const d = this.data.find(d => d.barcode === this.barcode);
      if (d) {
        this.messageService.error('该条码已存在列表中。。。');
        return;
      }

      if (this.scanType === this.enumObject.ScanType.OutStorage && result.expiryDate) {
        const validateMaterialExpiryDateInput = new ValidateMaterialExpiryDateInput()
        validateMaterialExpiryDateInput.materialId = result.materialId;
        validateMaterialExpiryDateInput.batchNo = result.batchNo;
        validateMaterialExpiryDateInput.expiryDate = result.expiryDate;
        this.materialOutStorageServiceProxy.validateMaterialExpiryDate(validateMaterialExpiryDateInput).subscribe((c: ValidateMaterialExpiryDateOutput) => {
          if (c.success) {
            this.data = [result, ...this.data];
          } else {
            this.nzModalService.confirm({
              nzTitle: '是否继续使用?',
              nzContent: '存在更早校期的物料',
              nzOnOk: () => {
                this.data = [result, ...this.data];
              }
            });
          }
        });
      } else {
        this.data = [result, ...this.data];
      }
      this.barcode = '';
      this.scanInputElement.nativeElement.focus();
    });
  }
  delete(dto: any) {
    this.data = this.data.filter(d => d != dto);
  }

  switchChange(item): void {
    console.log(item)
  }




  ngOnInit() {

    //this.scanInput.nativeElement.focus();
  }

  ngAfterViewInit() {
    console.log('view Init')
  }

  show(scanType: number, outInStorageType: number): void {
    this.validateBarcodeInput = new ValidateBarcodeInput();
    this.validateBarcodeInput.outInStorageType = outInStorageType;
    this.scanType = scanType;
    this.outStorageType = outInStorageType;
    this.data = [];
    this.isVisible = true;
    this.barcode = '';
    setTimeout(() => {
      console.log(this.scanInputElement);
      this.scanInputElement.nativeElement.focus();
    }, 300);

  }

  save(): void {
    this.modalSave.emit(this.data);
    this.handleCancel();
  }



  handleCancel(): void {
    this.isVisible = false;
  }

}

