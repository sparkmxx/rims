import {Component, OnInit, Injector,ViewChild} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';
import {SidebarComponent} from './sidebar/sidebar.component';
import {WebSettingService} from './webSettingService';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent extends AppComponentBase implements OnInit {
    isCollapsed = true;
    @ViewChild('appSidebar') appSidebar:SidebarComponent
    constructor(injector: Injector,public webSetting:WebSettingService) {
        super(injector);
    }

    ngOnInit() {

    }
    

}
