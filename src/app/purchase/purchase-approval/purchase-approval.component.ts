import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';
import {
  MaterialPurchaseServiceProxy,GetMaterialPurchasePaginationOutput,WaitingForPurchaseApprovalListInput,PagedResultDtoOfWaitingForPurchaseApprovalListOutput,WaitingForPurchaseApprovalListOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import { ApprovalDrawerComponent} from '@app/common/approval-drawer/approval-drawer.component';
@Component({
  selector: 'app-purchase-approval',
  templateUrl: './purchase-approval.component.html',
  styleUrls: ['./purchase-approval.component.less']
})
export class PurchaseApprovalComponent extends PagedListingComponentBase<WaitingForPurchaseApprovalListOutput> {
    @ViewChild('approvalDrawer') approvalDrawer: ApprovalDrawerComponent;
    data: WaitingForPurchaseApprovalListOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    mapOfCheckedId: { [key: string]: boolean } = {};
    waitingForPurchaseApprovalListInput:WaitingForPurchaseApprovalListInput=new WaitingForPurchaseApprovalListInput();
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialPurchaseServiceProxy: MaterialPurchaseServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.waitingForPurchaseApprovalListInput.init(this.queryDTO);
        this.waitingForPurchaseApprovalListInput.maxResultCount=request.maxResultCount;
        this.waitingForPurchaseApprovalListInput.skipCount=request.skipCount;
        this.materialPurchaseServiceProxy.waitingForApprovalList(this.waitingForPurchaseApprovalListInput)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfWaitingForPurchaseApprovalListOutput) => {
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

    delete(): void {

    }
    
    approval(item):void{
        this.approvalDrawer.show(item.id);
    }

    checkAll(value: boolean): void {
      this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    }

 




    
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

