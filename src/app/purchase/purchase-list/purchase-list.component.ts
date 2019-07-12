import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';
import {
  MaterialPurchaseServiceProxy,PagedResultDtoOfGetMaterialPurchasePaginationOutput,EntityDtoOfGuid,GetMaterialPurchasePaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.less']
})
export class PurchaseListComponent extends PagedListingComponentBase<GetMaterialPurchasePaginationOutput> {
    data: GetMaterialPurchasePaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    mapOfCheckedId: { [key: string]: boolean } = {};
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialPurchaseServiceProxy: MaterialPurchaseServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.materialPurchaseServiceProxy.getMaterialPurchases(this.queryDTO.startDate,this.queryDTO.endDate,undefined,undefined,this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId?Number(this.queryDTO.organizationId):undefined, this.queryDTO.materialTypeId, undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback();
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialPurchasePaginationOutput) => {
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
        // this.modelService.confirm({
        //     nzTitle: '是否删除该记录?',
        //     nzContent: '删除不可恢复，请谨慎操作',
        //     nzOnOk: () => {
        //         this.approvalWorkflowServiceProxy.deleteApprovalWorkflow(record.id)
        //             .pipe(finalize(() => {
        //                 this.refresh();
        //                 this.messageService.create('success', `删除成功`);
        //             }))
        //             .subscribe(() => {
        //             });
        //     }
        // });
    }
    clearParam():void{
      this.queryDTO=new QueryConditionDTO();
    }
    invalidMaterialPurchase():void{
      const ids=[];
      for (let key in this.mapOfCheckedId){
        if(this.mapOfCheckedId[key]){
          const input= new EntityDtoOfGuid();
          input.id=key;
          ids.push(input);
        }
      }
      this.modelService.confirm({
        nzTitle: '是否作废?',
        nzContent: '作废不可恢复，请谨慎操作',
        nzOnOk: () => {
            this.materialPurchaseServiceProxy.invalidMaterialPurchase(ids)
                .pipe(finalize(() => {
                    this.refresh();
                    this.messageService.create('success', `作废成功`);
                }))
                .subscribe(() => {
                });
        }
    });
    }

    checkAll(value: boolean): void {
      this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
    }

    closingMaterialPurchase():void{
      const ids=[];
      for (let key in this.mapOfCheckedId){
        if(this.mapOfCheckedId[key]){
          const input= new EntityDtoOfGuid();
          input.id=key;
          ids.push(input);
        }
      }
      this.modelService.confirm({
        nzTitle: '是否作废?',
        nzContent: '作废不可恢复，请谨慎操作',
        nzOnOk: () => {
            this.materialPurchaseServiceProxy.closingMaterialPurchase(ids)
                .pipe(finalize(() => {
                    this.refresh();
                    this.messageService.create('success', `结案成功`);
                }))
                .subscribe(() => {
                });
        }
    });
    }
    purchaseSyncK3():void{
      for (let key in this.mapOfCheckedId){
        if(this.mapOfCheckedId[key]){
          const input= new EntityDtoOfGuid();
          input.id=key;
          this.materialPurchaseServiceProxy.purchaseSyncK3(input)
                .pipe(finalize(() => {
                    this.refresh();
                    this.messageService.create('success', `同步成功`);
                }))
                .subscribe(() => {
                });
        }
      }

    }
    
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

