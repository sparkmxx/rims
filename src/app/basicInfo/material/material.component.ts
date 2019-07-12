import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef, UploadFile } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import {
    MaterialServiceProxy, PagedResultDtoOfGetMaterialPaginationOutput, GetMaterialPaginationOutput,MaterialImportDto
} from '@shared/service-proxies/service-proxies';
import {QueryConditionDTO} from '@shared/customDTO';
import { finalize } from 'rxjs/operators';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import { AppConsts } from '@shared/AppConsts';
@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.less']
})
export class MaterialComponent extends PagedListingComponentBase<GetMaterialPaginationOutput> {

    @ViewChild('materialEditModal') materialEditModal: MaterialEditComponent;
    data: GetMaterialPaginationOutput[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
    queryDTO:QueryConditionDTO=new QueryConditionDTO();
    constructor(private materialServiceProxy: MaterialServiceProxy,
        private modelService: NzModalService,
        private injector: Injector,
        private messageService: NzMessageService) {
        super(injector);
    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.materialServiceProxy.getMaterials(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId, this.queryDTO.materialTypeId,  undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGetMaterialPaginationOutput) => {
                this.loading = false;
                this.data = result.items;
                this.showPaging(result, pageNumber);
            });
    }
    clearParam():void{
        this.queryDTO= new QueryConditionDTO();
        this.refresh();
    }
    // uploadComplete(e:any):void{
    //     console.log(e);
    // }
    download():void{
        window.location.href="/assets/file/material.xlsx";
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
                
                this.materialServiceProxy.handleImportFile(info.file.response.result.path).pipe().subscribe((result: MaterialImportDto[]) => {
                   this.nzMessage.success('上传成功');
                   this.refresh();
                });

                break;
            case 'error':
                this.nzMessage.error('上传失败');
                this.loading = false;
                break;
        }
    }

    delete(dto: GetMaterialPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.materialServiceProxy.deleteMaterial(dto.id)
                    .pipe(finalize(() => {
                        this.refresh();
                        this.messageService.create('success', `删除成功`);
                    }))
                    .subscribe(() => {
                    });
            }
        });
    }

    edit(id?: any): void {
        this.materialEditModal.show(id);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
