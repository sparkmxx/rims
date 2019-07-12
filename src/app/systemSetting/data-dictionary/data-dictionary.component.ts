import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';

import {
    DataDictionaryServiceProxy,
    PagedResultDtoOfGeDataDictionaryPaginationOutput,
    GeDataDictionaryPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';

import {DataDictionaryEditComponent} from 'app/systemSetting/data-dictionary/data-dictionary-edit/data-dictionary-edit.component';

@Component({
    selector: 'app-data-dictionary',
    templateUrl: './data-dictionary.component.html',
    styleUrls: ['./data-dictionary.component.less']
})
export class DataDictionaryComponent extends PagedListingComponentBase<GeDataDictionaryPaginationOutput> {
    data: GeDataDictionaryPaginationOutput[] = [];
    loading = false;
    filter = '';
    expandDataCache = {};
    @ViewChild('dataDictionaryEdit') dataDictionaryEdit: DataDictionaryEditComponent;

    constructor(private dataDictionaryService: DataDictionaryServiceProxy,
                private modelService: NzModalService,
                private injector: Injector,
                private messageService: NzMessageService) {
        super(injector);

    }

    list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading = true;
        this.dataDictionaryService.getDataDictionarys('', this.filter, '', request.maxResultCount, request.skipCount)
            .pipe(finalize(() => {
                finishedCallback()
            }))
            .subscribe((result: PagedResultDtoOfGeDataDictionaryPaginationOutput) => {
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

    delete(record: GeDataDictionaryPaginationOutput): void {
        this.modelService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.dataDictionaryService.deleteDataDictionary(record.id)
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
        this.dataDictionaryEdit.add();
    }

    edit(obj: GeDataDictionaryPaginationOutput): void {
        this.dataDictionaryEdit.edit(obj);
    }


    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}

