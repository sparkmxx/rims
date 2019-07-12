import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef,UploadFile} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {
  VendorServiceProxy,PagedResultDtoOfGetVendorPaginationOutput,GetVendorPaginationOutput,VendorImportDto
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {VendorEditComponent} from './vendor-edit/vendor-edit.component';
import { AppConsts } from '@shared/AppConsts';
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.less']
})
export class VendorComponent extends PagedListingComponentBase<GetVendorPaginationOutput> {

    @ViewChild('vendorEditModal') vendorEditModal: VendorEditComponent;
    data: GetVendorPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    constructor(private vendorServiceProxy: VendorServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.vendorServiceProxy.getVendors(undefined,undefined,undefined,undefined,undefined,undefined,undefined,this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetVendorPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    download(): void {
        window.location.href = "/assets/file/vendor.xlsx";
      }
      uploadComplete(info: { file: UploadFile }): void {
        switch (info.file.status) {
          case 'uploading':
            this.loading = true;
            break;
          case 'done':
            this.loading = false;
            var pathArray = info.file.response.result.path.split("\\")
            var fileName = pathArray[pathArray.length - 1];
    
            this.vendorServiceProxy.handleImportFile(info.file.response.result.path).pipe().subscribe((result: VendorImportDto[]) => {
                    this.messageService.create('success',`上传成功`);
                    this.refresh();
            });
    
            break;
          case 'error':
            this.nzMessage.error('上传失败');
            this.loading = false;
            break;
        }
      }

    delete(vendor: GetVendorPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.vendorServiceProxy.deleteVendor(vendor.id)
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
        this.vendorEditModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
