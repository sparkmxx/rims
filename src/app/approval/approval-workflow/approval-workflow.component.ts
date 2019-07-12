
import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';

import {
  ApprovalWorkflowServiceProxy,PagedResultDtoOfGetApprovalWorkflowPaginationOutput,GetApprovalWorkflowPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

import {ApprovalWorkflowEditComponent} from './approval-workflow-edit/approval-workflow-edit.component';
@Component({
  selector: 'app-approval-workflow',
  templateUrl: './approval-workflow.component.html',
  styleUrls: ['./approval-workflow.component.less']
})
export class ApprovalWorkflowComponent extends PagedListingComponentBase<GetApprovalWorkflowPaginationOutput> {
    data: GetApprovalWorkflowPaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    @ViewChild('approvalWorkflowEdit') approvalWorkflowEdit: ApprovalWorkflowEditComponent;

    constructor(private approvalWorkflowServiceProxy: ApprovalWorkflowServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.approvalWorkflowServiceProxy.getApprovalWorkflows(this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetApprovalWorkflowPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.updateExpandDataCache();
                this.showPaging(result, pageNumber);
            });
    }

    updateExpandDataCache(): void {
        this.expandDataCache = {};
        this.data.forEach((item, idx) => {
            const i = idx.toString();
            if (!this.expandDataCache[i]) {
                this.expandDataCache[i] = {
                    expand: false,
                    data: {...item}
                };
            }
        });
    }

    delete(record: GetApprovalWorkflowPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.approvalWorkflowServiceProxy.deleteApprovalWorkflow(record.id)
                    .pipe(finalize(() => {
                        this.refresh();
                        this.messageService.create('success', `删除成功`);
                    }))
                    .subscribe(() => {
                    });
            }
        });
    }

    add(): void {
        this.approvalWorkflowEdit.show();
    }

    edit(obj: GetApprovalWorkflowPaginationOutput): void {
        this.approvalWorkflowEdit.show(obj.id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

