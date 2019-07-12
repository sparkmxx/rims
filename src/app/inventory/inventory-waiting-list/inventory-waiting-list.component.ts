import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import { Router} from '@angular/router';
import {
  MaterialInventoryServiceProxy,PagedResultDtoOfGetMaterialInventoryPaginationOutput,GetMaterialInventoryPaginationOutput,FileDto
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-inventory-waiting-list',
  templateUrl: './inventory-waiting-list.component.html',
  styleUrls: ['./inventory-waiting-list.component.less']
})
export class InventoryWaitingListComponent extends PagedListingComponentBase<GetMaterialInventoryPaginationOutput> {
    data: GetMaterialInventoryPaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    mapOfCheckedId: { [key: string]: boolean } = {};

    constructor(private materialInventoryServiceProxy: MaterialInventoryServiceProxy,
                private injector: Injector,
                private router:Router
                ) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.materialInventoryServiceProxy.getMaterialInventorys(undefined,undefined,undefined,undefined,undefined,undefined,this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialInventoryPaginationOutput) => {
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
    check(data:GetMaterialInventoryPaginationOutput): void {
     //  this.router.navigate(['/app/inventory/check',{id:data.id}]);
       this.router.navigateByUrl('/app/inventory/check/' + data.id); 
    }

    
    exportFile(id:string):void{
        this.materialInventoryServiceProxy.getInventoryToExcel(id).subscribe((result:FileDto)=>{
            this.downloadTempFile(result);
            this.nzMessage.create('success','导出成功');
        })
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

