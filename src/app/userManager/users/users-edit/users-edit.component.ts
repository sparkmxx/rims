
import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef } from '@angular/core';
import {
  RoleServiceProxy, CreateOrUpdateUserInput, ListResultDtoOfRoleListDto, RoleListDto,
  UserServiceProxy, GetUserForEditOutput, OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto, OrganizationUnitDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NzTreeNode } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.less']
})
export class UsersEditComponent extends AppComponentBase {

  @ViewChild('modalContent') modalContent: ElementRef;

  visible = false;
  saving = false;
  validateForm: FormGroup;
  userDto: CreateOrUpdateUserInput = new CreateOrUpdateUserInput();
  confirmPassword: string = '';
  treeNodes: NzTreeNode[] = [];
  //organizations: OrganizationUnitDto[] = [];
  roles: RoleListDto[];
  mapOfCheckedId: { [key: string]: boolean } = {};
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private roleService: RoleServiceProxy,
    private userServeice: UserServiceProxy,
    private organizationUnitService: OrganizationUnitServiceProxy,
    private formatOrganizationUnitIdPipe: FormatOrganizationUnitIdPipe,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      emailAddress: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [this.confirmValidator]],
    });
  }
  getList(): void {
    // this.organizationUnitService.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
    //   this.organizations = result.items;
    //   this.treeNodes = this.convertToTreeNode(this.organizations);
    // });
    this.roleService.getRoleList().pipe().subscribe((result: ListResultDtoOfRoleListDto) => {
      this.roles = result.items;
    });

  }
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  };
  show(id?: number): void {
    this.mapOfCheckedId={};
    if (id) {
      this.userServeice.getUserForEdit(id)
        .pipe(finalize(() => {
          this.visible = true;
        }))
        .subscribe((result: GetUserForEditOutput) => {
          this.userDto.init(result);
          result.roles.forEach((d)=>{
            if(d.isAssigned){
              this.mapOfCheckedId[d.roleName]=true;
            }
          })
        });
    } else {
      this.userDto = new CreateOrUpdateUserInput();
    }
    this.getList();
    this.visible = true;
    
  }




  saveUser(): void {
    // this.userDto.user.organizationUnitId = Number(this.organizationUnitId);
    // this.userDto.user.organizationUnitName = this.formatOrganizationUnitIdPipe.transform(this.userDto.user.organizationUnitId, this.organizations);
    this.userDto.assignedRoleNames=[];
    for (let item in this.mapOfCheckedId) {
      console.log(item);
      if(this.mapOfCheckedId[item]){
        this.userDto.assignedRoleNames.push(item);
      }
    }
    this.userDto.user.isActive=true;
    
    this.saving = true;
    this.userServeice.createOrUpdateUser(this.userDto)
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
