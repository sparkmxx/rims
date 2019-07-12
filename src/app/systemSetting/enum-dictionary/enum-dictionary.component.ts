import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';

import {
    EnumDescriptionServiceProxy,
    PagedResultDtoOfGeEnumDescriptionPaginationOutput,
    GeEnumDescriptionPaginationOutput,
    EnumDescriptionItemDto
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

import {EnumDictionaryEditComponent} from 'app/systemSetting/enum-dictionary/enum-dictionary-edit/enum-dictionary-edit.component';


@Component({
    selector: 'app-enum-dictionary',
    templateUrl: './enum-dictionary.component.html',
    styleUrls: ['./enum-dictionary.component.less']
})
export class EnumDictionaryComponent extends PagedListingComponentBase<GeEnumDescriptionPaginationOutput> {
    data: GeEnumDescriptionPaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    @ViewChild('enumDictionaryEdit') enumDictionaryEdit: EnumDictionaryEditComponent;

    constructor(private enumDescriptionService: EnumDescriptionServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.enumDescriptionService.getEnumDescriptions('', this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGeEnumDescriptionPaginationOutput) => {
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

    delete(record: GeEnumDescriptionPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.enumDescriptionService.deleteEnumDescription(record.id)
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
        this.enumDictionaryEdit.add();
    }

    edit(obj: GeEnumDescriptionPaginationOutput): void {
        this.enumDictionaryEdit.edit(obj);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

