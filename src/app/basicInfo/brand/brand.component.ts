import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  BrandServiceProxy,PagedResultDtoOfGetBrandPaginationOutput,GetBrandPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {BrandEditComponent} from './brand-edit/brand-edit.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.less']
})
export class BrandComponent extends PagedListingComponentBase<GetBrandPaginationOutput> {

    @ViewChild('brandEditComponentModal') brandEditComponentModal: BrandEditComponent;
    data: GetBrandPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';

    constructor(private brandService: BrandServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.brandService.getBrands(undefined,undefined,undefined,this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetBrandPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(brand: GetBrandPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.brandService.deleteBrand(brand.id)
                    .pipe(finalize(() => {
                        this.refresh();
                        this.messageService.create('success', `删除成功`);
                    }))
                    .subscribe(() => {
                    });
            }
        });
    }

    edit(id?:any): void {
        this.brandEditComponentModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
