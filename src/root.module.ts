import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import { AbpModule } from '@abp/abp.module';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GestureConfig } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';
registerLocaleData(zh);
export function appInitializerFactory(injector: Injector,
    platformLocation: PlatformLocation) {
    return () => {

        abp.ui.setBusy();
        return new Promise<boolean>((resolve, reject) => {
            AppConsts.appBaseHref = getBaseHref(platformLocation);
            const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

            AppPreBootstrap.run(appBaseUrl, () => {
                abp.event.trigger('abp.dynamicScriptsInitialized');
                const appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {
                        abp.ui.clearBusy();

                        if (shouldLoadLocale()) {
                            const angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
                            import(`@angular/common/locales/${angularLocale}.js`)
                                .then(module => {
                                    registerLocaleData(module.default);
                                    resolve(result);
                                }, reject);
                        } else {
                            resolve(result);
                        }
                    },
                    (err) => {
                        abp.ui.clearBusy();
                        reject(err);
                    }
                );
            });
        });
    };
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
    if (!AppConsts.localeMappings) {
        return locale;
    }

    const localeMapings = _.filter(AppConsts.localeMappings, { from: locale });
    if (localeMapings && localeMapings.length) {
        return localeMapings[0]['to'];
    }

    return locale;
}

export function shouldLoadLocale(): boolean {
    return abp.localization.currentLanguage.name && abp.localization.currentLanguage.name !== 'en-US';
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    return abp.localization.currentLanguage.name;
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        ModalModule.forRoot(),
        NgZorroAntdModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        RootRoutingModule,
        HttpClientModule
    ],
    declarations: [
        RootComponent

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector, PlatformLocation],
            multi: true
        },

        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
        { provide: NZ_I18N, useValue: zh_CN }
    ],
    bootstrap: [RootComponent]
})
// {
//     provide: LOCALE_ID,
//     useFactory: getCurrentLanguage
// },
export class RootModule {

    constructor() {
        console.log(new Date());
        console.log(new Date().toLocaleString());
        Date.prototype.toJSON = function () {
            return moment(this).format('YYYY-MM-DD');
        }
        Date.prototype.toString = function () {
            return moment(this).format('YYYY-MM-DD');
        }
        Date.prototype.toISOString = function () {
            return moment(this).format('YYYY-MM-DD');
        }
        
        // moment.fn.toString = function () {

        //     if (this.hour() == 0) {
        //         return this.format('YYYY-MM-DD');
        //     }

        //     return this.format('YYYY-MM-DD HH:mm');

        // }

        // moment.fn.toJSON = function () {
        //     if (this.hour() == 0) {
        //         return this.format('YYYY-MM-DD');
        //     }
        //     return this.format('YYYY-MM-DD HH:mm');

        // }



        // moment.fn.toISOString = function () {
        //     if (this.hour() == 0) {
        //         return this.format('YYYY-MM-DD');
        //     }
        //     return this.format('YYYY-MM-DD HH:mm');

        // }
    }
}

export function getBaseHref(platformLocation: PlatformLocation): string {
    const baseUrl = platformLocation.getBaseHrefFromDOM();
    if (baseUrl) {
        return baseUrl;
    }

    return '/';
}

function getDocumentOrigin() {
    if (!document.location.origin) {
        const port = document.location.port ? ':' + document.location.port : '';
        return document.location.protocol + '//' + document.location.hostname + port;
    }

    return document.location.origin;
}
