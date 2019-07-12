import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  ApprovalRecordServiceProxy,ApprovalActionInput,GetApprovalRecordDetailDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-approval-drawer',
  templateUrl: './approval-drawer.component.html',
  styleUrls: ['./approval-drawer.component.less']
})
export class ApprovalDrawerComponent extends AppComponentBase implements OnInit {
  saveDto: ApprovalActionInput=new ApprovalActionInput();
  isVisible: boolean = false;
  saving: boolean = false;
  data: GetApprovalRecordDetailDto[] = [];
  loading = false;
  childrenVisible=false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(private approvalRecordServiceProxy: ApprovalRecordServiceProxy,
    
    private injector: Injector,
    private messageService: NzMessageService
    ) {
    super(injector);
  }
  ngOnInit() {
  }

  show(id?:string): void {
    this.saveDto.eventSourceId=id;
    this.saveDto.approvalResultState=this.enumObject.ApprovalResultState.Agreement;
    this.list();
    this.isVisible = true;
  }

  list(): void {
    this.approvalRecordServiceProxy.getDetails(this.saveDto.eventSourceId)
      .pipe(finalize(() => {
      }))
      .subscribe((result:GetApprovalRecordDetailDto[]) => {
        this.data=result;
        console.log(this.data);
      });
  }
  save(): void {
    this.saving = true;
    this.approvalRecordServiceProxy.approvalAction(this.saveDto)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe(() => {
        this.modalSave.emit(null);
        this.close();
        this.messageService.create('success', `审批成功`);
      });
  }

  close(): void {
    this.isVisible = false;
  }

}
