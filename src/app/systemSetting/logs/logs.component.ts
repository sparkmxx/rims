import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';

import {
  AuditLogServiceProxy,PagedResultDtoOfAuditLogListDto,AuditLogListDto
  
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.less']
})
export class LogsComponent extends PagedListingComponentBase<AuditLogListDto> implements OnInit {
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    data: AuditLogListDto[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    userName='';
    serviceName='';
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private auditLogServiceProxy: AuditLogServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService
                ) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        
        this.auditLogServiceProxy.getAuditLogs(this.queryDTO.startDate,this.queryDTO.endDate,this.userName,this.serviceName,undefined,undefined,undefined,undefined, undefined, undefined, request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfAuditLogListDto) => {
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    ngOnInit():void{
      this.queryDTO.startDate=new Date();
      this.queryDTO.endDate=new Date();
      this.refresh();
    }
    delete(): void {
        
    }
    clearParam():void{
        this.queryDTO= new QueryConditionDTO();
    }
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
