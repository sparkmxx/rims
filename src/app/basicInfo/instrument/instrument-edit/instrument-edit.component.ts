
import { Component, EventEmitter, Injector, OnInit, Output,ViewChild } from '@angular/core';
import {
  InstrumentServiceProxy, CreateOrUpdateInstrumentInput, GetInstrumentForEditOutput, OrganizationUnitDto,
  OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, ListResultDtoOfRoleListDto
} from '@shared/service-proxies/service-proxies';
import { NzMessageService ,NzTreeComponent} from 'ng-zorro-antd';

import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-instrument-edit',
  templateUrl: './instrument-edit.component.html',
  styleUrls: ['./instrument-edit.component.less']
})
export class InstrumentEditComponent extends AppComponentBase implements OnInit {
  saveDto: CreateOrUpdateInstrumentInput;
  isVisible: boolean = false;
  saving: boolean = false;
  validateForm: FormGroup;
  treeNodes: NzTreeNode[] = [];
  organizations: OrganizationUnitDto[] = [];
  organizationUnitId: string = '';
  loading = false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
  constructor(private instrumentServiceProxy: InstrumentServiceProxy,
    private organizationUnitService: OrganizationUnitServiceProxy,
    private injector: Injector,
    private messageService: NzMessageService,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      shortName: [null, [Validators.required]],
      organizationUnitId: [null, [Validators.required]]

    });
  }
  getList(): void {
    this.organizationUnitService.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizations = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizations);
    });
  }
  show(id?: string | undefined): void {
    this.saveDto = new CreateOrUpdateInstrumentInput();
    if (id) {
      this.loading = true;
      this.instrumentServiceProxy.getInstrumentForEdit(id)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((result: GetInstrumentForEditOutput) => {
          this.saveDto.init(result);
        });
    }
    this.getList();
    this.isVisible = true;
  }



  save(): void {
    this.saving = true;
    this.saveDto.code = Math.random().toString();
    const org= this.nzTreeComponent.getSelectedNodeList().find(d=>d.key==this.saveDto.organizationId.toString());
    this.saveDto.organizationName=org.title;
    this.instrumentServiceProxy.createOrUpdateInstrument(this.saveDto)
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
