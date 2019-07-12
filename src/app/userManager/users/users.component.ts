import { Component, Injector, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import {
    UserServiceProxy, UserListDto,PagedResultDtoOfUserListDto,UpdateUserPermissionsInput,PermissionServiceProxy,ListResultDtoOfGetAllPermissionOutput,GetAllPermissionOutput
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { UploadFile,NzTreeNode,NzTreeComponent,NzMessageService,NzModalService} from 'ng-zorro-antd';
import {UsersEditComponent} from './users-edit/users-edit.component';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.less'],
    animations: [appModuleAnimation()]
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> {

    @ViewChild('userEditDrawer') userEditDrawer: UsersEditComponent;
    @ViewChild('nzTreeComponent') nzTreeComponent: NzTreeComponent;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    active = false;
    users: UserListDto[];
    sortName = null;
    sortValue = null;
    loading = false;
    treeLoading=false;
    filter = '';
    updateUserPermissionsInput:UpdateUserPermissionsInput=new UpdateUserPermissionsInput();
	permissionTreeNodes: NzTreeNode[] = [];
	permissions: GetAllPermissionOutput[] = [];
	defaultCheckedKeys = [];
    searchRole = [];
    visible=false;
    filterRoleArray = [
        { text: 'admin', value: 'admin' },
        { text: 'user', value: 'user' }
    ];
    constructor(injector: Injector,
        private _userService: UserServiceProxy,private permissionService: PermissionServiceProxy,
        private messageService: NzMessageService,
        private nzModalService:NzModalService) {
        super(injector);
       
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading=true;
        this._userService.getUsers(this.filter,'',undefined,'', request.maxResultCount, request.skipCount).pipe(
            finalize(() => {
                this.loading=false;
                finishedCallback()
            })
        ).subscribe((result: PagedResultDtoOfUserListDto) => {
            console.log(result.items);
            this.users = result.items;
            this.showPaging(result, pageNumber);
        });
    }

    // getOrganizationList(): void {
    //     this.organizationUnitService.getList().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
    //         this.organizationUnits = result.items;
    //     });
    // }



    keypress(event: any): void {
        if (event.keyCode == 13) {
            this.refresh();
        }
    }





    filterRoleChange(value: string[]): void {
        this.searchRole = value;
        const filterFunc = (item) => {
            return (this.searchRole.length ? this.searchRole.some(role => item.roleNames.indexOf(role) !== -1) : true);
        };
        this.users = this.users.filter(item => filterFunc(item));

    }

    sort(sort: { key: string, value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        if (this.sortName && this.sortValue) {
            this.users = this.users.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
        } else {
            this.users = this.users;
        }
    }

    protected delete(user: UserListDto): void {
        this.nzModalService.confirm({
            nzTitle: '是否删除该记录?',
            nzContent: '删除不可恢复，请谨慎操作',
            nzOnOk: () => {
                this._userService.deleteUser(user.id)
                .subscribe(() => {
                    this.nzMessage.success(`成功删除${user.name}`)
                    this.refresh();
                });
            }
        });
        abp.message.confirm(
            '你确定删除 ' + user.name + '?',
            (result: boolean) => {
                if (result) {
                  
                }
            }
        );
    }

    // Show Modals
    createUser(): void {
        console.log(this.userEditDrawer);
        console.log('create');
        this.userEditDrawer.show();
    }

    editUser(user: UserListDto): void {
        this.userEditDrawer.show(user.id);
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
	getAllPermissions(userId?: number): void {
        this.treeLoading=true;
        this.permissionService.getUserAllPermissions(userId ? userId : undefined)
        .pipe(finalize(()=>{this.treeLoading=false;}))
        .subscribe((result: ListResultDtoOfGetAllPermissionOutput) => {
			this.permissions = result.items;
			this.permissionTreeNodes = this.convertToTreeNode(this.permissions,"id", "name");
			this.defaultCheckedKeys = [];
			this.recursiveGetIsGrantedKey(this.permissions);
		});
	}

	open(user: UserListDto): void {
		this.updateUserPermissionsInput.id = user.id;
		this.getAllPermissions(user.id);
		this.visible = true;
	}

	close(): void {
		this.visible = false;
	}
	save(): void {
        let checkeds=[];
		this.updateUserPermissionsInput.grantedPermissionNames = this.getNZTreeComponentCheckeds(this.nzTreeComponent.getCheckedNodeList(),checkeds).map(d=>d.title)
		this._userService.updateUserPermissionsWithCustom(this.updateUserPermissionsInput)
			.subscribe(() => {
				this.close();
				this.messageService.create('success', `保存成功`);
			});
	}
}
