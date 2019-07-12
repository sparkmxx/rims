import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {
  BrandServiceProxy,CreateOrUpdateBrandInput,GetBrandForEditOutput
} from '@shared/service-proxies/service-proxies';
import {NzMessageService} from 'ng-zorro-antd';
import {AppComponentBase} from '@shared/app-component-base';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.less']
})
export class BrandEditComponent extends AppComponentBase implements OnInit {
    saveDto: CreateOrUpdateBrandInput;
    isVisible: boolean = false;
    saving: boolean = false;
    validateForm: FormGroup;
    loading=false;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(private brandServiceProxy: BrandServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService,
                private fb: FormBuilder) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            shortName: [null, [Validators.required]],

        });
    }

    show(id?: string | undefined): void {
      this.saveDto = new CreateOrUpdateBrandInput();
      if(id){
        this.loading=true;
        this.brandServiceProxy.getBrandForEdit(id)
        .pipe(finalize(() => {
            this.loading = false;
        }))
        .subscribe((result:GetBrandForEditOutput) => {
           this.saveDto.init(result);
        });
      }
       this.isVisible = true;
    }

 

    save(): void {
        this.saving = true;
        this.saveDto.code=Math.random().toString();
        this.brandServiceProxy.createOrUpdateBrand(this.saveDto)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this.modalSave.emit(null);
                this.close();
                this.messageService.create('success', `保存成功`);
            });
    }

    close(): void {
        this.isVisible = false;
    }

}
