import {Component, OnInit, Input} from '@angular/core';
import {
    PermissionServiceProxy,
    GetGrantedPermissionOutput,
    ListResultDtoOfGetGrantedPermissionOutput
} from '@shared/service-proxies/service-proxies';
import {WebSettingService} from '../webSettingService';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
    permissions: GetGrantedPermissionOutput[] = [];
    constructor(private permissionService: PermissionServiceProxy,public webSetting:WebSettingService) {

    }

    ngOnInit() {
        this.getGrantedPermissions();
    }


    getGrantedPermissions(): void {
        this.permissionService.getGrantedPermissions().pipe().subscribe((result: ListResultDtoOfGetGrantedPermissionOutput) => {
            this.permissions = result.items;

        });
    }

}
