import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import {
  InspectionItemServiceProxy, GetInspectionItemForEditOutput, CreateOrUpdateInspectionItemInput, DataDictionaryServiceProxy, DataDictionaryDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
@Component({
  selector: 'app-inspection-item-edit',
  templateUrl: './inspection-item-edit.component.html',
  styleUrls: ['./inspection-item-edit.component.less']
})
//PerformanceVerificationNegativePositive
export class InspectionItemEditComponent extends AppComponentBase implements OnInit {
  saveDto: CreateOrUpdateInspectionItemInput = new CreateOrUpdateInspectionItemInput();
  isVisible: boolean = false;
  saving: boolean = false;
  validateForm: FormGroup;
  treeNodes: NzTreeNode[] = [];
  loading = false;
  childrenVisible = false;
  dicts = [];
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(private inspectionItemServiceProxy: InspectionItemServiceProxy,

    private injector: Injector,
    private messageService: NzMessageService,
    private dataDictionaryServiceProxy: DataDictionaryServiceProxy,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      performanceVerificationType: [null, [Validators.required]],
      minReferenceRange: [null, [Validators.required]],
      maxReferenceRange: [null, [Validators.required]],
      referenceUnit: [null, [Validators.required]],
      deviation: [null, [Validators.required]],
      calculationType: [null, [Validators.required]],
      referenceResult: [null, [this.referenceResultValidator]]

    });
  }
  referenceResultValidator = (control: FormControl) => {
    console.log(control);
    console.log(control.value);
    if (this.saveDto.performanceVerificationType === this.enumObject.PerformanceVerificationType.NegativePositive && !control.value) {
      console.log('unpass');
      return { rentedErr: true };
      
    }
    else {
      console.log('pass')
      return null;
    }

  };
  show(id?: string | undefined): void {
    this.saveDto = new CreateOrUpdateInspectionItemInput();
    if (id) {
      this.loading = true;
      this.inspectionItemServiceProxy.getInspectionItemForEdit(id)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((result: GetInspectionItemForEditOutput) => {
          this.saveDto.init(result);
        });
    }
    this.getDictionary();
    this.isVisible = true;
  }

  getDictionary(): void {
    this.dataDictionaryServiceProxy.getDataDictionaryValues([
      this.enumObject.DictType.InspectResultType
    ]).subscribe((result: DataDictionaryDto[]) => {
        result.forEach((d) => {
          this.dicts = d.dataDictionaryDetails.map((d) => {
            d.value = d.id;
            return d;
          });

        });
      });
  }

  save(): void {
    this.saving = true;
    this.saveDto.code = Math.random().toString();
    this.inspectionItemServiceProxy.createOrUpdateInspectionItem(this.saveDto)
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
