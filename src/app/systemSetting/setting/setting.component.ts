import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  TenantSettingsServiceProxy,TenantSettingsEditDto,InventorySettingsEditDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.less']
})
export class SettingComponent extends AppComponentBase implements OnInit {
  saveDto: TenantSettingsEditDto=new TenantSettingsEditDto();
  isVisible: boolean = false;
  saving: boolean = false;
  treeNodes: NzTreeNode[] = [];
  loading = false;
  childrenVisible=false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(private tenantSettingsServiceProxy: TenantSettingsServiceProxy,
    
    private injector: Injector,
    private messageService: NzMessageService
    ) {
    super(injector);
  }
  ngOnInit() {
    this.saveDto.inventory=new InventorySettingsEditDto();
  }

  show(): void {
    this.loading = true;
    this.tenantSettingsServiceProxy.getAllSettings()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result: TenantSettingsEditDto) => {
        this.saveDto.init(result);
      });
    this.isVisible = true;
  }



  save(): void {
    this.saving = true;
    this.tenantSettingsServiceProxy.updateAllSettings(this.saveDto)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe(() => {
        this.modalSave.emit(null);
        this.close();
        this.messageService.create('success', `保存成功`);
      });
  }

  close(): void {
    this.isVisible = false;
  }

}
