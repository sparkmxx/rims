﻿import { Component, ViewContainerRef, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { LoginService } from './login/login.service';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment'; 

@Component({
    templateUrl: './account.component.html',
    styleUrls: [
        './account.component.less'
    ],
    encapsulation: ViewEncapsulation.None
})
export class AccountComponent extends AppComponentBase implements OnInit {

    private viewContainerRef: ViewContainerRef;

    versionText: string;
    currentYear: number;

    public constructor(
        injector: Injector,
        private _loginService: LoginService
    ) {
        super(injector);

        this.currentYear = new Date().getFullYear();
        this.versionText = this.appSession.application.version + ' [' + moment(this.appSession.application.releaseDate).format('yyyyMMdd') + ']';
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled;
    }

    ngOnInit(): void {
        $('body').attr('class', 'login-page');
    }
}