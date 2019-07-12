
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import {
  OrganizationUnitServiceProxy,WarehouseInfoServiceProxy,GetOrganizationWarehouseInfosDto,UpdateOrganizationOutInStorageSettingInput
  ,OrganizationOutInStorageSettingDto
} from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode,NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-organization-units-setting',
  templateUrl: './organization-units-setting.component.html',
  styleUrls: ['./organization-units-setting.component.less']
})

export class OrganizationUnitsSettingComponent extends AppComponentBase implements OnInit {

  @ViewChild('modalContent') modalContent: ElementRef;
  isVisible= false;
  saving= false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  expandKeys = [];
  value: string;
  data:GetOrganizationWarehouseInfosDto[]=[];
  updateOrganizationOutInStorageSettingInput:UpdateOrganizationOutInStorageSettingInput;
  orgId:number;
  constructor(private organizationUnitService: OrganizationUnitServiceProxy,
    private warehouseInfoServiceProxy:WarehouseInfoServiceProxy,

    private injector: Injector
    ) {
    super(injector);
  }
  ngOnInit() {
    
    
  }



 


  getList(id:number):void{
    this.warehouseInfoServiceProxy.getOrganizationWarehouseInfos(id).subscribe((result:GetOrganizationWarehouseInfosDto[])=>{
      this.data=result;
    })
  }
  


  save(): void {
    this.updateOrganizationOutInStorageSettingInput=new UpdateOrganizationOutInStorageSettingInput();
    this.updateOrganizationOutInStorageSettingInput.targetOrganizationId=this.orgId;
    this.updateOrganizationOutInStorageSettingInput.organizationOutInStorageSettings=this.data.map(d=>{
        const t=new OrganizationOutInStorageSettingDto();
        t.organizationId=d.organizationId;
        t.organizationName=d.organizationName;
        t.isAutoIn=d.isAutoIn;
        t.isAutoOut=d.isAutoOut;
        t.warehouseInfoId=d.warehouseInfoId;
        t.warehouseInfoName=d.warehouseInfoName;
        return t;
        
    })
    this.organizationUnitService.setOrganizationOutInStorageSetting(this.updateOrganizationOutInStorageSettingInput).subscribe(()=>{
        this.nzMessage.success('设置成功');
    });
    this.close();
  }




  show(id:number):void{
    this.isVisible=true;
    this.getList(id);
    this.orgId=id;
  }

  close(): void {
    this.isVisible = false;
  }

}
