
import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    UserServiceProxy, UserListDto,PagedResultDtoOfUserListDto,OrganizationUnitServiceProxy,UsersToOrganizationUnitInput
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-organization-units-users',
  templateUrl: './organization-units-users.component.html',
  styleUrls: ['./organization-units-users.component.less']
})
export class OrganizationUnitsUsersComponent extends PagedListingComponentBase<UserListDto> {

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    active = false;
    users: UserListDto[]=[];
    sortName = null;
    sortValue = null;
    loading = false;
    filter = '';
    visible=false;
    searchRole = [];
    isAllDisplayDataChecked = false;
    isIndeterminate = false;
    listOfDisplayData: any[] = [];
    listOfAllData: any[] = [];
    mapOfCheckedId: { [key: string]: boolean } = {};
    checkedUsers:any[]=[];
    usersToOrganizationUnitInput:UsersToOrganizationUnitInput;
    constructor(injector: Injector,
        private _userService: UserServiceProxy,private organizationUnitService:OrganizationUnitServiceProxy) {
        super(injector);
       
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {

        this._userService.getUsers(this.filter,'',undefined,'', request.maxResultCount, request.skipCount).pipe(
            finalize(() => {
                finishedCallback()
            })
        ).subscribe((result: PagedResultDtoOfUserListDto) => {
            console.log(result.items);
            this.users = result.items;
            this.showPaging(result, pageNumber);
        });
    }


    
      refreshStatus(user:UserListDto): void {
        this.isAllDisplayDataChecked = this.users.every(item => this.mapOfCheckedId[item.id]);
        console.log(this.mapOfCheckedId);
        if(this.mapOfCheckedId[user.id]){
            if(this.checkedUsers.indexOf(user.id)<0){
                this.checkedUsers.push(user.id);
            }
        }else{
            this.checkedUsers=this.checkedUsers.filter(d=>d!=user.id);
        }
        
      }
    
      checkAll(value: boolean): void {
        this.users.forEach(item => (this.mapOfCheckedId[item.id] = value));
      }

    keypress(event: any): void {
        if (event.keyCode == 13) {
            this.refresh();
        }
    }


    delete():void{
      
    }
    saveUsers():void{
        console.log(this.checkedUsers);
        this.usersToOrganizationUnitInput.userIds=this.checkedUsers;
        this.organizationUnitService.addUsersToOrganizationUnit(this.usersToOrganizationUnitInput)
        .subscribe(() => {
          
          this.nzMessage.success('添加成功');
        });
        this.modalSave.emit(true);
        this.visible=false;
    }
    close():void{
        this.visible=false;
    }
    add(orgId:number):void{
        this.usersToOrganizationUnitInput=new UsersToOrganizationUnitInput();
        this.usersToOrganizationUnitInput.organizationUnitId=orgId;
        this.visible=true;
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


}
