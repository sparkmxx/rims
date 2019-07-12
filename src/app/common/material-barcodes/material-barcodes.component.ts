
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  BarcodePrintRecordServiceProxy,GetEventBarcodesDto,BarcodeInfo,GetInventoryCodesOutput
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-material-barcodes',
  templateUrl: './material-barcodes.component.html',
  styleUrls: ['./material-barcodes.component.less']
})
export class MaterialBarcodesComponent extends AppComponentBase implements OnInit {
  isVisible = false;
  loading = false;
  data:string[]=[];
  canDelete:Boolean=false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(private barcodePrintRecordServiceProxy: BarcodePrintRecordServiceProxy,
    private injector: Injector,
    private messageService: NzMessageService
    ) {
    super(injector);
  }
  ngOnInit() {
    
  }

  show(id: string | undefined,materialId:string,batchNo:string,expiryDate:any): void {
    if (id) {
      this.loading = true;
      this.barcodePrintRecordServiceProxy.getEventBarcodes(id,materialId,batchNo,expiryDate)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((result: GetEventBarcodesDto[]) => {
          this.data=result.map(d=>d.barcode);
        });
    }
    this.isVisible = true;
  }

  showInventoryBarcodes(materialId:string,batchNo:string,expiryDate:any):void{
    this.loading = true;
    this.barcodePrintRecordServiceProxy.getInventoryCodes(materialId,batchNo,expiryDate).pipe(finalize(()=>{
      this.loading=false;
    })).subscribe((result:GetInventoryCodesOutput)=>{
        this.data=result.barcodes;
    });
    this.isVisible = true;
  }


  showBarcodes(barcodes:string[],canDelete:Boolean|undefined):void{
    this.data=barcodes;
    this.canDelete=canDelete;
    this.isVisible=true;
    
  }

  deleteBarcodes(barcode:string):void{
    this.data=this.data.filter(d=>d!=barcode);
  }

  save(): void {
    if(this.canDelete){
      this.modalSave.emit(this.data);
    }
    this.isVisible=false;
  }

  close(): void {
    this.isVisible = false;
  }

}

