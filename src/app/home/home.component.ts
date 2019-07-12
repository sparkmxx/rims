import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import {
  FocusInfomationServiceProxy,GetDashboardInfoOutput,ThisMonthPurchaseDto,ThisMonthStorageDto,ThisMonthOutStorageDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends AppComponentBase implements OnInit  {
  loading=false;
  data:GetDashboardInfoOutput=new GetDashboardInfoOutput();
  constructor(private focusInfomationServiceProxy: FocusInfomationServiceProxy,
    private injector: Injector,
    private nzMessageService:NzMessageService,
  ) {
    super(injector);

  }
  // purchase: ThisMonthPurchaseDto | undefined;
  // storage: ThisMonthStorageDto | undefined;
  // outStorage: ThisMonthOutStorageDto | undefined;
  ngOnInit() {
    this.data.purchase=new ThisMonthPurchaseDto();
    this.data.storage=new ThisMonthStorageDto();
    this.data.outStorage=new ThisMonthOutStorageDto();
    this.getInfo(this.appSession.user.organizationUnitId);
  }
  getInfo(orgId:any):void{
    this.loading=true;
    this.focusInfomationServiceProxy.getDashboardInfo(orgId).pipe(finalize(()=>{
      this.loading=false;
    })).subscribe((result:GetDashboardInfoOutput)=>{
        this.data=result;
    });
  }
}
