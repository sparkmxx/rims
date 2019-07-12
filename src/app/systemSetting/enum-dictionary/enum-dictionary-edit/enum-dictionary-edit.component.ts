import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {
    EnumDescriptionServiceProxy,
    CreateOrUpdateEnumDescriptionInput,
    EnumerationInfo,
    CreateOrUpdateEnumDescriptionItemInput, GeEnumDescriptionPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {NzMessageService} from 'ng-zorro-antd';
import {AppComponentBase} from '@shared/app-component-base';
import {finalize} from 'rxjs/operators';

@Component({
    selector: 'app-enum-dictionary-edit',
    templateUrl: './enum-dictionary-edit.component.html',
    styleUrls: ['./enum-dictionary-edit.component.less']
})
export class EnumDictionaryEditComponent extends AppComponentBase implements OnInit {
    enum: CreateOrUpdateEnumDescriptionInput = new CreateOrUpdateEnumDescriptionInput();
    isVisible = false;
    isConfirmLoading = false;
    editCache = {};
    data = [];
    enums: EnumerationInfo[];
    selectEnum: EnumerationInfo = new EnumerationInfo();

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    constructor(private enumDescriptionServiceProxy: EnumDescriptionServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService
                ) {
        super(injector);
    }


    getEnums(): void {
        this.enumDescriptionServiceProxy.getEnumTypes().pipe().subscribe((result: EnumerationInfo[]) => {
            this.enums = result;
        });
    }



    selectChange(): void {
        this.enum.init(this.selectEnum);
        this.enum.enumDescriptionItems = this.selectEnum.enumItems as CreateOrUpdateEnumDescriptionItemInput[];
    }

    updateEditCache(): void {
        this.editCache = this.editCache || {};
        this.editCache = this.editCache || {};
        this.enum.enumDescriptionItems.forEach((item, idx) => {
            const i = idx.toString();
            if (!this.editCache[i]) {
                this.editCache[i] = {
                    edit: false,
                    data: {...item}
                };
            }
        });
    }




    ngOnInit() {
        this.getEnums();
    }

    add(): void {
        this.enum = new CreateOrUpdateEnumDescriptionInput();
        this.enum.enumDescriptionItems = [];
        this.updateEditCache();
        this.isVisible = true;
    }

    edit(obj: GeEnumDescriptionPaginationOutput): void {
        this.enum = new CreateOrUpdateEnumDescriptionInput();
        this.enum.init(obj);
        this.updateEditCache();
        this.isVisible = true;
    }

    save(): void {
        this.addService();
    }

    addService(): void {
        this.isConfirmLoading = true;
        this.enumDescriptionServiceProxy.createOrUpdateEnumDescription(this.enum)
            .pipe(finalize(() => {
                this.isConfirmLoading = false;
            }))
            .subscribe(() => {
                this.modalSave.emit(null);
                this.handleCancel();
                this.messageService.create('success', `添加成功`);
            });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

}
