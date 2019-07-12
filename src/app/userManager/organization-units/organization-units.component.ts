
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { OrganizationUnitServiceProxy, OrganizationUnitDto, OrganizationUnitUserListDto, ListResultDtoOfOrganizationUnitDto, PagedResultDtoOfOrganizationUnitUserListDto, UserListDto } from '@shared/service-proxies/service-proxies';
import { OrganizationUnitsEditComponent } from './organization-units-edit/organization-units-edit.component';
import { OrganizationUnitsUsersComponent } from './organization-units-users/organization-units-users.component'
import { PagedListingComponentBase, PagedRequestDto, PagedResultDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { OrganizationUnitsSettingComponent } from './organization-units-setting/organization-units-setting.component';
import { AppComponentBase } from '@shared/app-component-base';
export interface TreeNodeInterface {
  id: number;
  displayName: string;
  level: number;
  expand: boolean;
  selected: false;
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-organization-units',
  templateUrl: './organization-units.component.html',
  styleUrls: ['./organization-units.component.less']
})



export class OrganizationUnitsComponent extends AppComponentBase implements OnInit {

  @ViewChild('organizationUnitsEditModal') organizationUnitsEditModal: OrganizationUnitsEditComponent;
  @ViewChild('organizationUnitsUserModal') organizationUnitsUserModal: OrganizationUnitsUsersComponent;
  @ViewChild('organizationUnitsSettingModal') organizationUnitSetting: OrganizationUnitsSettingComponent;
  data: OrganizationUnitDto[] = [];
  selectedRow: OrganizationUnitDto = null;
  expandDataCache = {};
  organizationUsers: OrganizationUnitUserListDto[] = [];
  pageSize = 10;
  pageNumber = 1;
  totalPages = 1;
  totalItems: number;
  loading = false;
  organizationUsersLoading = false;
  constructor(private organizationUnitService: OrganizationUnitServiceProxy, private messageService: NzMessageService, private nzModalService: NzModalService, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.list();
    console.log(this.organizationUsers);
    console.log('organizationUsers');
  }

  public refresh(): void {
    this.list();
  }

  public list(): void {
    this.loading = true;
    this.organizationUnitService.getOrganizationUnitsWithChildren().pipe(finalize(() => {
      this.loading = false;
    }))
      .subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
        this.data = result.items;
        this.data.forEach(item => {
          this.expandDataCache[item.id] = this.convertTreeToList(item);
        });

      });
  }

  showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;
    this.totalItems = result.totalCount;
    this.pageNumber = pageNumber;
  }
  selectOrganization(org: OrganizationUnitDto): void {
    this.selectedRow = org;
    this.getOrganizationUnitUsers();
  }
  getOrganizationUnitUsers(): void {
    if (this.selectedRow) {
      this.getOrganizationUnitPaging(this.selectedRow.id, this.pageNumber);
    } else {
      
      this.nzMessage.info('请选择组织');
    }
  }
  getOrganizationUnitPaging(id: number, page: number): void {
    const req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;
    this.organizationUsersLoading = true;
    this.getDataPage(req, page, () => {
      this.organizationUsersLoading = false;
    });
  }
  getDataPage(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.organizationUnitService.getOrganizationUnitUsers(this.selectedRow.id, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result: PagedResultDtoOfOrganizationUnitUserListDto) => {
        this.organizationUsers = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(organizationUnit: OrganizationUnitDto): void {

    this.nzModalService.confirm({
      nzTitle: '是否删除?',
      nzContent: '删除不可恢复，请谨慎操作',
      nzOnOk: () => {
        this.organizationUnitService.deleteOrganizationUnit(organizationUnit.id)
          .subscribe(() => {
           
            this.nzMessage.success('删除成功');
            this.list();
          });
      }
    });
  }
  removeUser(user: UserListDto): void {
    this.organizationUnitService.removeUserFromOrganizationUnit(user.id, this.selectedRow.id)
      .subscribe(() => {
        
        this.nzMessage.success('成功删除');
        this.getOrganizationUnitUsers();
      });
  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      
      hashMap[node.id] = true;
      array.push(node);
    }
  }


  createOrganizationUnit(): void {
    this.organizationUnitsEditModal.add(this.selectedRow ? this.selectedRow.id : undefined);
  }

  editOrganizationUnit(organizationUnit: OrganizationUnitDto): void {
    this.organizationUnitsEditModal.show(organizationUnit.id);
  }

  addOrganizationUnitUsers(): void {
    this.organizationUnitsUserModal.add(this.selectedRow.id);
  }

  organizationWareHouseSetting(): void {
    if (this.selectedRow){
      this.organizationUnitSetting.show(this.selectedRow.id)
    }else {
      this.nzMessage.error('请选择组织');
    }
    
  }

} 