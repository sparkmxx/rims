import {Component, OnInit, Injector, Input,ViewChild,Output,EventEmitter} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';
import {AppAuthService} from '@shared/auth/app-auth.service';
import {SettingComponent} from '@app/systemSetting/setting/setting.component';
import {StockValidityWarningComponent} from '@app/warning/stock-validity-warning/stock-validity-warning.component';
import { MaterialUnArrivedWarningComponent } from '@app/warning/material-un-arrived-warning/material-un-arrived-warning.component';
import { MaterialStockWarningComponent } from '@app/warning/material-stock-warning/material-stock-warning.component';
import { CertificateExpirationWarningComponent } from '@app/warning/certificate-expiration-warning/certificate-expiration-warning.component';
import {WebSettingService} from '../webSettingService';
import {
    WarningServiceProxy,GetWarningInfoOutput
  } from '@shared/service-proxies/service-proxies';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent extends AppComponentBase implements OnInit {

    shownLoginName = '';
    organizationUnitName='';
    @Input() isCollapsed: boolean;
    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
    warningInfo:GetWarningInfoOutput=new GetWarningInfoOutput();
    @ViewChild('appSetting') appSetting: SettingComponent;
    @ViewChild('stockValidityWarning') stockValidityWarning: StockValidityWarningComponent;
    @ViewChild('materialUnArrivedWarning') materialUnArrivedWarning: MaterialUnArrivedWarningComponent;
    @ViewChild('materialStockWarning') materialStockWarning: MaterialStockWarningComponent;
    @ViewChild('certificateExpirationWarning') certificateExpirationWarning: CertificateExpirationWarningComponent;
    constructor(injector: Injector,
                private _authService: AppAuthService,
                private warningServiceProxy:WarningServiceProxy,
                public webSetting:WebSettingService) {
        super(injector);
    }

    collapsed(): void {
        this.toggle.emit();
    }
    showSetting():void{
        this.appSetting.show();
    }
    ngOnInit() {
        this.getWarningInfo();
        this.shownLoginName = this.appSession.getShownLoginName();
        this.organizationUnitName=this.appSession.user.organizationUnitName;
    }
    
    stockValidityPeriod():void{
        this.stockValidityWarning.show();
    }
    materialUnArrivedShow():void{
        this.materialUnArrivedWarning.show();
    }
    materialStockWarningShow():void{
        this.materialStockWarning.show();
    }
    certificateExpirationWarningShow():void{
        this.certificateExpirationWarning.show();
    }
    getWarningInfo():void{
        this.warningServiceProxy.getWarningInfo(this.appSession.userId,this.appSession.user.organizationUnitId).subscribe((result:GetWarningInfoOutput)=>{
            this.warningInfo=result;
        });
    }
    logout(): void {
        this._authService.logout();
    }
}
