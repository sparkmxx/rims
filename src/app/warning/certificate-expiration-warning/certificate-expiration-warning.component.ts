
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  WarningServiceProxy,CertificateExpirationDetailOutput,MaterialDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-certificate-expiration-warning',
  templateUrl: './certificate-expiration-warning.component.html',
  styleUrls: ['./certificate-expiration-warning.component.less']
})
export class CertificateExpirationWarningComponent extends AppComponentBase implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  data:MaterialDto[] = [];
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
    this.warningServiceProxy.getCertificateExpirationDetail(this.appSession.userId, this.appSession.user.organizationUnitId).pipe(finalize(() => {
      this.loading = false;
    })).subscribe((result: CertificateExpirationDetailOutput) => {
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

