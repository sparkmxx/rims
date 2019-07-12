import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import {
  RoleServiceProxy, PermissionServiceProxy, GetRoleForEditOutput, RoleEditDto,
  GetAllPermissionOutput, ListResultDtoOfGetAllPermissionOutput, CreateOrUpdateRoleInput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTreeNode,NzTreeComponent } from 'ng-zorro-antd';


import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'role-edit-modal',
  templateUrl: './role-edit.component.html'
})
export class RoleEditComponent extends AppComponentBase {

  @ViewChild('modalContent') modalContent: ElementRef;
  @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;

  isVisible = false;
  saving = false;
  validateForm: FormGroup;
  model: GetRoleForEditOutput = null;
  savingModel: CreateOrUpdateRoleInput = null
  permissionTreeNodes: NzTreeNode[] = [];
  permissions: GetAllPermissionOutput[] = [];
  defaultCheckedKeys = [];
  defaultCheckedNames = [];
  defaultExpandedKeys=[];
  defaultSelectedKeys=[];
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _roleService: RoleServiceProxy,
    private permissionService: PermissionServiceProxy,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }

  getAllPermissions(roleId?: number): void {
    this.permissionService.getRoleAllPermissions(roleId ? roleId : undefined).pipe().subscribe((result: ListResultDtoOfGetAllPermissionOutput) => {
      this.permissions = result.items;
      this.permissionTreeNodes = this.convertToTreeNode(this.permissions, "id", "name");
      this.defaultCheckedKeys = [];
       this.recursiveGetIsGrantedKey(this.permissions);
    });
  }

  onCheckBoxChange(event: any): void {
    console.log(event);
    // if (event.checkedKeys.length > 0) {
    //   this.recursiveGetCheckedKey(event.checkedKeys);
    //   this.recursiveGetCheckedName(event.checkedKeys);
    // } else {
    //   this.recursiveGetCheckedKey([event.node]);
    //   this.recursiveGetCheckedName([event.node]);
    // }
  }

  recursiveGetIsGrantedKey(dataSource: GetAllPermissionOutput[]) {
    for (const item of dataSource) {
      var index = this.defaultCheckedKeys.indexOf(item.id);
      if (index > -1) {
        this.defaultCheckedKeys.splice(index, 1);
      }
      if (item.isGranted) {
        this.defaultCheckedKeys.push(item.id);
      }
      if (item.children) {
        this.recursiveGetIsGrantedKey(item.children);
      }
    }
  }

  // recursiveGetCheckedKey(dataSource: NzTreeNode[]) {
  //   for (const item of dataSource) {
  //     var index = this.defaultCheckedKeys.indexOf(item.key);
  //     if (index > -1) {
  //       this.defaultCheckedKeys.splice(index, 1);
  //     }
  //     if (item.isChecked) {
  //       this.defaultCheckedKeys.push(item.key);
  //     }
  //     if (item.children) {
  //       this.recursiveGetCheckedKey(item.children);
  //     }
  //   }
  // }


  // recursiveGetCheckedName(dataSource: NzTreeNode[]) {
  //   for (const item of dataSource) {
  //     var index = this.defaultCheckedNames.indexOf(item.title);
  //     if (index > -1) {
  //       this.defaultCheckedNames.splice(index, 1);
  //     }
  //     if (item.isChecked) {
  //       this.defaultCheckedNames.push(item.title);
  //     }
  //     if (item.children) {
  //       this.recursiveGetCheckedName(item.children);
  //     }
  //   }
  // }


  show(id?: number): void {
    this.getAllPermissions(id);
    this._roleService.getRoleForEdit(id)
      .pipe(finalize(() => {
        this.isVisible = true;
      }))
      .subscribe((result: GetRoleForEditOutput) => {
        this.model = result;
      });

  }
  
 

  // checkPermission(permissionName: string): string {
  //   if (this.model.grantedPermissionNames.indexOf(permissionName) != -1) {
  //     return "checked";
  //   }
  //   else {
  //     return "";
  //   }
  // }

  save(): void {
    //this.saving = true;
    this.savingModel= new CreateOrUpdateRoleInput();
    this.savingModel.role=this.model.role;
    // console.log(this.defaultCheckedKeys);
  
    // console.log(this.defaultExpandedKeys);
    // console.log(this.defaultSelectedKeys);
    // console.log(this.nzTreeComponent.getTreeNodes())
 
    // console.log(this.nzTreeComponent.getSelectedNodeList())
    // console.log(this.nzTreeComponent.getExpandedNodeList())
   
  
    this._roleService.createOrUpdateRole(this.savingModel)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        this.nzMessage.success('保存成功');
        this.saving = false;
        this.close();
        this.modalSave.emit(null);
      });

  }

  close(): void {
    this.isVisible = false;
  }
}
