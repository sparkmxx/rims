
import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';
import {
  PerformanceVerificationServiceProxy,PagedResultDtoOfGetWaitForVerfifyMaterialsOutput,GetWaitForVerfifyMaterialsOutput
  
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';


@Component({
  selector: 'app-verification-wating',
  templateUrl: './verification-wating.component.html',
  styleUrls: ['./verification-wating.component.less']
})
export class VerificationWatingComponent extends PagedListingComponentBase<GetWaitForVerfifyMaterialsOutput> {
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    data: GetWaitForVerfifyMaterialsOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private performanceVerificationServiceProxy: PerformanceVerificationServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        
        this.performanceVerificationServiceProxy.getWaitForVerfifyMaterials(undefined,undefined,undefined,undefined,'', this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetWaitForVerfifyMaterialsOutput) => {
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
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
