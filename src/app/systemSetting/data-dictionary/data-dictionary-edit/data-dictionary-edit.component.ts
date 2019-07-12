import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {
    DataDictionaryServiceProxy,
    CreateOrUpdateDataDictionaryInput,
    NameValueDto,
    CreateOrUpdateDataDictionaryDetailInput, GeDataDictionaryPaginationOutput
} from '@shared/service-proxies/service-proxies';
import {NzMessageService} from 'ng-zorro-antd';
import {AppComponentBase} from '@shared/app-component-base';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-data-dictionary-edit',
    templateUrl: './data-dictionary-edit.component.html',
    styleUrls: ['./data-dictionary-edit.component.less']
})
export class DataDictionaryEditComponent extends AppComponentBase implements OnInit {
    dict: CreateOrUpdateDataDictionaryInput = new CreateOrUpdateDataDictionaryInput();
    isVisible = false;
    isConfirmLoading = false;
    editCache = {};
    data = [];
    dictTypes = [];
    validateForm: FormGroup;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    constructor(private dataDictionaryService: DataDictionaryServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService,
                private fb: FormBuilder) {
        super(injector);
    }


    getDictTypes(): void {
        this.dataDictionaryService.getDictTypes().pipe().subscribe((result: NameValueDto[]) => {
            this.dictTypes = result;
            this.dictTypes = this.dictTypes.map(d => {
                d.value = Number(d.value);
                return d;
            });
            console.log(this.dictTypes);
        });
    }

    switchChange(item): void {
        console.log(item)
    }

    deleteDataDictionaryDetails(data: CreateOrUpdateDataDictionaryDetailInput): void {
        const key = this.dict.dataDictionaryDetails.indexOf(data).toString();
        this.dict.dataDictionaryDetails = this.dict.dataDictionaryDetails.filter(d => d !== data);
        delete this.editCache[key];
    }


    selectChange(datas: any[], obj, fieldValue: string, fieldName: string, dataFieldValue: string | undefined, dataFieldName: string | undefined): void {
        dataFieldValue = dataFieldValue || fieldValue;
        dataFieldName = dataFieldName || fieldName;
        const item = datas.find(d => d[dataFieldValue] === obj[fieldValue]);
        obj[fieldName] = item[dataFieldName];
    }


    updateEditCache(): void {
        this.editCache = this.editCache || {};
        this.dict.dataDictionaryDetails.forEach((item, idx) => {
            const i = idx.toString();
            if (!this.editCache[i]) {
                this.editCache[i] = {
                    edit: false,
                    data: {...item}
                };
            }
        });
    }

    addDataDictionaryDetails(): void {
        const dictObj = new CreateOrUpdateDataDictionaryDetailInput();
        this.dict.dataDictionaryDetails = [...this.dict.dataDictionaryDetails, dictObj];
        this.editCache = this.editCache || {};
        this.editCache[(this.dict.dataDictionaryDetails.length-1).toString()] = {
            edit: true,
            data: {...dictObj}
        };
    }


    ngOnInit() {
        this.getDictTypes();
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            dictType: [null, [Validators.required]]
        });
    }

    add(): void {
        this.dict = new CreateOrUpdateDataDictionaryInput();
        this.dict.dataDictionaryDetails = [];
        this.updateEditCache();
        this.getDictTypes();
        this.isVisible = true;
    }

    edit(obj: GeDataDictionaryPaginationOutput): void {
        this.dict = new CreateOrUpdateDataDictionaryInput();
        this.dict.init(obj);
        console.log(this.dict);
        this.updateEditCache();
        this.getDictTypes();
        this.isVisible = true;
    }

    save(): void {
        this.addService();
    }

    addService(): void {
        this.isConfirmLoading = true;
        this.dataDictionaryService.createOrUpdateDataDictionary(this.dict)
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

