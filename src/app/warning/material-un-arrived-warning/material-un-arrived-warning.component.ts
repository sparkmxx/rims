import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  WarningServiceProxy,PurchaseMaterialUnArrivedDetailOutput,MaterialPurchaseDetailDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-material-un-arrived-warning',
  templateUrl: './material-un-arrived-warning.component.html',
  styleUrls: ['./material-un-arrived-warning.component.less']
})
export class MaterialUnArrivedWarningComponent extends AppComponentBase implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  data:MaterialPurchaseDetailDto[] = [];
  loading = false;
  outStorageType: number;
  scanType: number;
  barcode = '';
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


  constructor(private warningServiceProxy: WarningServiceProxy,
    private injector: Injector,
    private messageService: NzMessageService
  ) {
    super(injector);
  }

  getList(): void {
    this.loading=true;
    this.warningServiceProxy.getPurchaseMaterialUnArrivedDetail(this.appSession.userId, this.appSession.user.organizationUnitId).pipe(finalize(() => {
      this.loading = false;
    })).subscribe((result: PurchaseMaterialUnArrivedDetailOutput) => {
        this.data=result.details;
    });
  }

  delete(dto: any) {
    this.data = this.data.filter(d => d != dto);
  }

  stockValidityPeriod():void{

  }

  switchChange(item): void {
    console.log(item)
  }




  ngOnInit() {

  }

  show(): void {
    this.getList();
    this.isVisible = true;
  }

  save(): void {
    this.modalSave.emit(this.data);
    this.handleCancel();
  }



  handleCancel(): void {
    this.isVisible = false;
  }

}

