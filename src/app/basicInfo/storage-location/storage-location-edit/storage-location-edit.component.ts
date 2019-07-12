import { Component, EventEmitter, Injector, OnInit, Output,ViewChild} from '@angular/core';
import {
  StorageLocationServiceProxy,OrganizationUnitServiceProxy,OrganizationUnitDto,GetStorageLocationForEditOutput,
  CreateOrUpdateStorageLocationInput,ListResultDtoOfOrganizationUnitDto,WarehouseInfoServiceProxy,NameValueDto,CreateOrUpdateStorageLocationDetailInput
} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import {MaterialsSelectComponent} from '@app/common/materials-select/materials-select.component';
@Component({
  selector: 'app-storage-location-edit',
  templateUrl: './storage-location-edit.component.html',
  styleUrls: ['./storage-location-edit.component.less']
})
export class StorageLocationEditComponent extends AppComponentBase implements OnInit {
  saveDto: CreateOrUpdateStorageLocationInput=new CreateOrUpdateStorageLocationInput();
  isVisible: boolean = false;
  saving: boolean = false;
  validateForm: FormGroup;
  treeNodes: NzTreeNode[] = [];
  organizations: OrganizationUnitDto[] = [];
  organizationUnitId: string = '';
  loading = false;
  warehouses:NameValueDto[]=[];
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('materialsSelect') materialsSelect:MaterialsSelectComponent;
  constructor(private storageLocationServiceProxy: StorageLocationServiceProxy,
    private warehouseInfoServiceProxy:WarehouseInfoServiceProxy,
    private organizationUnitService: OrganizationUnitServiceProxy,
    private formatOrganizationUnitIdPipe:FormatOrganizationUnitIdPipe,
    private injector: Injector,
    private messageService: NzMessageService,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.saveDto.storageLocationDetails=[];
    this.validateForm = this.fb.group({
      locationName: [null, [Validators.required]],
      warehouseInfoId: [null, [Validators.required]],
      organizationUnitId: [null, [Validators.required]]

    });
  }
  getList(): void {
    this.organizationUnitService.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizations = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizations);
    });
    this.warehouseInfoServiceProxy.getWarehouseInfoList().pipe().subscribe((result: NameValueDto[]) => {
      this.warehouses = result;
    });
  }
  show(id?: string | undefined): void {
    this.saveDto = new CreateOrUpdateStorageLocationInput();
    this.saveDto.storageLocationDetails=[];
    if (id) {
      this.loading = true;
      this.storageLocationServiceProxy.getStorageLocationForEdit(id)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((result: GetStorageLocationForEditOutput) => {
          this.saveDto.init(result);
          this.saveDto.organizationId=result.organizationId;
        });
    }
    this.getList();
    this.isVisible = true;
  }


  confirmSelect(materials:any[]):void{
    materials.forEach((d)=>{
      const e=this.saveDto.storageLocationDetails.find(t=>t.materialId===d.id);
      if(!e){
        let t=new CreateOrUpdateStorageLocationDetailInput();
        t.materialId=d.id;
        t.materialName=d.name;
        t.materialShortName=d.shortName;
        t.hospitalMaterialCode=d.hospitalMaterialCode;
        this.saveDto.storageLocationDetails=[...this.saveDto.storageLocationDetails,t];
      }
    })
    
  }

  deleteStorageLocationDetails(m:CreateOrUpdateStorageLocationDetailInput):void{
        this.saveDto.storageLocationDetails=this.saveDto.storageLocationDetails.filter(d=>d!=m);
  }

  save(): void {
    this.saving = true;
    this.saveDto.organizationName=this.formatOrganizationUnitIdPipe.transform(this.saveDto.organizationId, this.organizations);
    this.storageLocationServiceProxy.createOrUpdateStorageLocation(this.saveDto)
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
  openChildren(): void {
    this.materialsSelect.show();
    //this.childrenVisible = true;
  }

  closeChildren(): void {
    //this.childrenVisible = false;
  }
}
