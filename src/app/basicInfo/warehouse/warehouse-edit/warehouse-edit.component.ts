import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import {
  WarehouseInfoServiceProxy, OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto,
  OrganizationUnitDto, GetWarehouseInfoForEditOutput, CreateOrUpdateWarehouseInfoInput, OrganizationWarehouseInfoDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTreeNode, NzTreeComponent } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-warehouse-edit',
  templateUrl: './warehouse-edit.component.html',
  styleUrls: ['./warehouse-edit.component.less']
})
export class WarehouseEditComponent extends AppComponentBase {

  @ViewChild('modalContent') modalContent: ElementRef;
  @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
  visible = false;
  saving = false;
  validateForm: FormGroup;
  saveDto: CreateOrUpdateWarehouseInfoInput = new CreateOrUpdateWarehouseInfoInput();
  treeNodes: NzTreeNode[] = [];
  organizations: OrganizationUnitDto[] = [];
  defaultCheckedKeys = [];
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private warehouseInfoServiceProxy: WarehouseInfoServiceProxy,
    private organizationUnitService: OrganizationUnitServiceProxy,
    private formatOrganizationUnitIdPipe: FormatOrganizationUnitIdPipe,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      warehouseGradeType: ['', [Validators.required]],
      organizationUnitIds: ['', [Validators.required]]
    });
  }
  getList(defaultCheckedKeys: any[]): void {
    this.organizationUnitService.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizations = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizations);
      this.defaultCheckedKeys = defaultCheckedKeys;
    });
  }
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };
  show(id?: string): void {
    this.saveDto = new CreateOrUpdateWarehouseInfoInput();
    this.defaultCheckedKeys = [];
    this.treeNodes = [];
    if (id) {
      this.warehouseInfoServiceProxy.getWarehouseInfoForEdit(id)
        .pipe(finalize(() => {
          this.visible = true;
        }))
        .subscribe((result: GetWarehouseInfoForEditOutput) => {
          this.saveDto.init(result);
          this.getList(result.organizationWarehouseInfos.map(d => d.organizationId));
          this.defaultCheckedKeys=result.organizationWarehouseInfos.map(d=>d.organizationId);
        });
    } else {
      this.getList([]);
    }

    this.visible = true;

  }




  saveUser(): void {
    // for (let item in this.mapOfCheckedId) {
    //   console.log(item);
    //   if(this.mapOfCheckedId[item]){
    //     this.saveDto.organizationWarehouseInfos.push(item);
    //   }
    // }
    this.saveDto.code = Math.random().toString();

    // let checkeds = [];
    // this.getNZTreeComponentCheckeds(this.nzTreeComponent.getSelectedNodeList(), checkeds);
    // this.saveDto.organizationWarehouseInfos = checkeds.map(d => {
    //   let org = new OrganizationWarehouseInfoDto();
    //   org.organizationId = Number(d.key);
    //   org.organizationName = d.title;
    //   return org;
    // });
    this.saveDto.organizationWarehouseInfos = this.nzTreeComponent.getSelectedNodeList().map((d => {
      let org = new OrganizationWarehouseInfoDto();
      org.organizationId = Number(d.key);
      org.organizationName = d.title;
      return org;
    }));
    this.saving = true;
    this.warehouseInfoServiceProxy.createOrUpdateWarehouseInfo(this.saveDto)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        
        this.nzMessage.success('保存成功');
        this.close();
        this.modalSave.emit(null);
      });

  }

  close(): void {
    this.visible = false;
  }
}
