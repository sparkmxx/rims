import { Component, Injector, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { LoginService } from './login.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import {
  OrganizationUnitServiceProxy, GetUserOrganizationUnitsInput, GetUserOrganizationUnitsOutput
} from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent extends AppComponentBase {

  @ViewChild('formBody') formBody: ElementRef;

  submitting: boolean = false;
  organizations: GetUserOrganizationUnitsOutput[] = [];
  getUserOrganizationUnitsInput: GetUserOrganizationUnitsInput = new GetUserOrganizationUnitsInput();
  loading = false;
  constructor(
    injector: Injector,
    public loginService: LoginService,
    private organizationUnitServiceProxy: OrganizationUnitServiceProxy,
    private _router: Router,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    $(this.formBody.nativeElement).find('input:first').focus();
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    this.submitting = true;
    this.loginService.authenticate(
      () => this.submitting = false
    );
  }
  accountBlur(): void {
    this.loading = true;
    this.getUserOrganizationUnitsInput.userNameOrEmailAddress = this.loginService.authenticateModel.userNameOrEmailAddress;
    this.organizationUnitServiceProxy.xGetUserOrganizationUnits(this.getUserOrganizationUnitsInput).subscribe((result: GetUserOrganizationUnitsOutput[]) => {
      this.loading = false;
      this.loginService.authenticateModel.organizationUnitId = result && result[0] ? result[0].id : 0;
      this.organizations = result;
    });

  }
  accountChange(): void {
    console.log('accountChange');
    this.loginService.authenticateModel.password='';
  }
  enterEvent(event: any): void {
    if (event.keyCode == 13) {
      if (event.srcElement.id == "Account") {
        $(this.formBody.nativeElement).find('#Password').focus();
      }

      if (event.srcElement.id == "Password") {
        $(this.formBody.nativeElement).find('#Login').focus();
      }

      if (event.srcElement.id == "Login") {
        this.login();
      }
    }

  }
}

