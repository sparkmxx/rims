import { Component, Injector, ViewChild } from '@angular/core';
import {
	RoleServiceProxy, ListResultDtoOfRoleListDto, RoleListDto, PermissionServiceProxy, GetRoleForEditOutput, RoleEditDto,
	GetAllPermissionOutput, ListResultDtoOfGetAllPermissionOutput, UpdateRolePermissionsInput
} from 'shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { NzTreeNode, NzTreeComponent, NzMessageService,NzModalService } from 'ng-zorro-antd';
@Component({
	templateUrl: './roles.component.html',
	animations: [appModuleAnimation()],
	styleUrls: ['./roles.component.less']
})
export class RolesComponent extends AppComponentBase {
	@ViewChild('roleEditModal') roleEditModal: RoleEditComponent;
	@ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
	visible = false;
	roles: RoleListDto[] = [];
	updateRolePermissionsInput: UpdateRolePermissionsInput = new UpdateRolePermissionsInput();
	loading = true;
	filter: string = "";
	model: GetRoleForEditOutput = null;
	permissionTreeNodes: NzTreeNode[] = [];
	permissions: GetAllPermissionOutput[] = [];
	defaultCheckedKeys = [];
	constructor(
		private injector: Injector,
		private rolesService: RoleServiceProxy,
		private permissionService: PermissionServiceProxy,
		private messageService: NzMessageService,
		private nzModalService:NzModalService
	) {
		super(injector);
	}

	getRoles(): void {
		this.loading = true;
		this.rolesService.getRoles(undefined)
			.subscribe((result: ListResultDtoOfRoleListDto) => {
				this.loading = false;
				this.roles = result.items;

			});
	}
	ngOnInit(): void {
		this.getRoles();
	}
	keypress(event: any): void {
		if (event.keyCode == 13) {
			this.getRoles();
		}
	}


	delete(role: RoleListDto): void {
		this.nzModalService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this.rolesService.deleteRole(role.id)
						.pipe(finalize(() => {
							this.nzMessage.success(`成功删除${role.displayName}`);
							this.getRoles();
						}))
						.subscribe(() => { });
            }
        });
		
	}
	sort(event: any): void {

	}

	// Show Modals
	createRole(): void {
		this.roleEditModal.show();
	}

	editRole(role: RoleListDto): void {
		this.roleEditModal.show(role.id);
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
	getAllPermissions(roleId?: number): void {
		this.permissionService.getRoleAllPermissions(roleId ? roleId : undefined).pipe().subscribe((result: ListResultDtoOfGetAllPermissionOutput) => {
			this.permissions = result.items;
			this.permissionTreeNodes = this.convertToTreeNode(this.permissions,  "id", "name");
			this.defaultCheckedKeys = [];
			this.recursiveGetIsGrantedKey(this.permissions);
			console.log(this.defaultCheckedKeys);
		});
	}

	open(role: RoleListDto): void {
		this.updateRolePermissionsInput.id = role.id;
		this.getAllPermissions(role.id);
		this.visible = true;
	}

	close(): void {
		this.visible = false;
	}

	save(): void {
		console.log(this.nzTreeComponent.getCheckedNodeList());
		let checkeds=[];
		this.getNZTreeComponentCheckeds(this.nzTreeComponent.getCheckedNodeList(),checkeds);
		this.updateRolePermissionsInput.grantedPermissionNames=checkeds.map(d=>d.title);
		this.rolesService.updateRolePermissionsWithCustom(this.updateRolePermissionsInput)
			.subscribe(() => {
				this.close();
				this.messageService.create('success', `保存成功`);
			});
	}
}
