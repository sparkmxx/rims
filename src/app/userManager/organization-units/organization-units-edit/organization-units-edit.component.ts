

import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import {
  OrganizationUnitServiceProxy,
  ListResultDtoOfOrganizationUnitDto,
  OrganizationUnitForEditDto, OrganizationUnitDto, CreateOrUpdateOrganizationUnitInput
} from '@shared/service-proxies/service-proxies';

import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode,NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-organization-units-edit',
  templateUrl: './organization-units-edit.component.html',
  styleUrls: ['./organization-units-edit.component.less']
})

export class OrganizationUnitsEditComponent extends AppComponentBase implements OnInit {

  @ViewChild('modalContent') modalContent: ElementRef;

  organizationUnitDto: CreateOrUpdateOrganizationUnitInput = new CreateOrUpdateOrganizationUnitInput();
  isVisible: boolean = false;
  saving: boolean = false;
  validateForm: FormGroup;
  treeNodes: any[] = [];
  organizationUnits: OrganizationUnitDto[] = [];
  //organizationUnitId:string='';
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  expandKeys = [];
  value: string;

  constructor(private organizationUnitService: OrganizationUnitServiceProxy,
    private nzMessageService:NzMessageService,
    private injector: Injector,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      displayName: [null, [Validators.required]]
    });
    
  }



  show(id: number|undefined): void {
    this.organizationUnitService.getOrganizationUnitForEdit(id).pipe().subscribe((result: OrganizationUnitForEditDto) => {
      this.organizationUnitDto.init(result);
      console.log(this.organizationUnitDto);
    });
    this.getList();
    this.isVisible = true;
  }
  add(parentId?:number|undefined):void{
    this.organizationUnitDto=new CreateOrUpdateOrganizationUnitInput();
    this.organizationUnitDto.parentId=parentId;
    this.getList();
    this.isVisible = true;
  }
  getList(): void {
      this.organizationUnitService.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizationUnits = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizationUnits);
      console.log(this.treeNodes);
    });
  }

  


  save(): void {
  //  this.organizationUnitDto.parentId = Number(this.organizationUnitDto.parentId);
    //const input= new CreateOrUpdateOrganizationUnitInput();
    this.saving = true;
    this.organizationUnitService.createOrUpdateOrganizationUnit(this.organizationUnitDto)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe(() => {
        this.modalSave.emit(null);
        this.close();
        this.nzMessageService.create('success','保存成功');
      });
  }




  onChange($event: string): void {
    console.log($event);
  }

  close(): void {
    this.isVisible = false;
  }

}
