import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { LocalizationService } from '@abp/localization/localization.service';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';
import { NotifyService } from '@abp/notify/notify.service';
import { SettingService } from '@abp/settings/setting.service';
import { MessageService } from '@abp/message/message.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { NzMessageService } from 'ng-zorro-antd';
import { WebSettingService } from '@app/layout/webSettingService';
export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;
    nzTreeNode: any[] = [];
    enumArray: any;
    enumObject: any;
    nzMessage: NzMessageService;
    webSettings: WebSettingService;
    remoteServiceBaseUrl=AppConsts.remoteServiceBaseUrl;
    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
        this.enumArray = AppConsts.enumArray;
        this.enumObject = AppConsts.enumObject;
        this.webSettings = injector.get(WebSettingService);
         this.nzMessage=injector.get(NzMessageService);
    }

    
    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }
	getNZTreeComponentCheckeds(data:any[],result:any[]):any[]{
        data.forEach((d)=>{
           if(d.children&&d.children.length>0){
               this.getNZTreeComponentCheckeds(d.children,result);
           }
           result.push(d);
       });
       return result;
   }
    convertToTreeNode(dataSource: any[], keyFieldName?: string, titleFieldName?: string, nodeName?: string): any[] {
        keyFieldName = keyFieldName ? keyFieldName : 'id';
        titleFieldName = titleFieldName ? titleFieldName : 'displayName';
        nodeName = nodeName ? nodeName : 'children';
        return this.recursiveTreeNode(dataSource, keyFieldName, titleFieldName, nodeName);

    }
    recursiveTreeNode(dataSource: any[], keyFieldName: string, titleFieldName: string, nodeName: string) {
        return dataSource.map((d) => {
            d['key'] = d[keyFieldName];
            d['title'] = d[titleFieldName];
            if (d[nodeName] && d[nodeName].length > 0) {
                d[nodeName] = this.recursiveTreeNode(d[nodeName], keyFieldName, titleFieldName, nodeName);
            } else {
                d['isLeaf'] = true;
            }
            return d;
        })
    }
    downloadTempFile(file):void{
        window.open(`${this.remoteServiceBaseUrl}/File/DownloadTempFile?fileType=${file.fileType}&fileToken=${file.fileToken}&fileName=${file.fileName}`);
    };
    selectKeyToName(data: any[], obj: any, key: string, value: string, nameField?: string, valueField?: string): void {
        if (!data) { return; }
        setTimeout(() => {
            nameField = nameField ? nameField : 'name';
            valueField = valueField ? valueField : 'value';
            const select = data.find(d => obj[key] == d[valueField]);
            obj[value] = select ? select[nameField] : '';

        });

    }


}
