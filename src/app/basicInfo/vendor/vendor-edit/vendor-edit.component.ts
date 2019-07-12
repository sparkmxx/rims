import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {
  VendorServiceProxy,GetVendorForEditOutput,CreateOrUpdateVendorInput
} from '@shared/service-proxies/service-proxies';
import {NzMessageService} from 'ng-zorro-antd';
import {AppComponentBase} from '@shared/app-component-base';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-vendor-edit',
  templateUrl: './vendor-edit.component.html',
  styleUrls: ['./vendor-edit.component.less']
})
export class VendorEditComponent extends AppComponentBase implements OnInit {
    saveDto: CreateOrUpdateVendorInput;
    isVisible: boolean = false;
    saving: boolean = false;
    validateForm: FormGroup;
    loading=false;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    constructor(private vendorServiceProxy: VendorServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService,
                private fb: FormBuilder) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            name: [null, [Validators.required]],
            shortName: [null, [Validators.required]],
            vendorType: [null, [Validators.required]],
            contact: [null, [Validators.required]],
            telephone: [null, [Validators.required]]

        });
    }

    show(id?: string | undefined): void {
      this.saveDto = new CreateOrUpdateVendorInput();
      if(id){
        this.loading=true;
        this.vendorServiceProxy.getVendorForEdit(id)
        .pipe(finalize(() => {
            this.loading = false;
        }))
        .subscribe((result:GetVendorForEditOutput) => {
           this.saveDto.init(result);
        });
      }
       this.isVisible = true;
    }

 

    save(): void {
        this.saving = true;
        this.saveDto.code=Math.random().toString();
        this.vendorServiceProxy.createOrUpdateVendor(this.saveDto)
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
