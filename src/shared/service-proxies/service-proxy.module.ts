import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';

import * as ApiServiceProxies from './service-proxies';

@NgModule({
    providers: [
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.TenantServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.PermissionServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.OrganizationUnitServiceProxy,
        ApiServiceProxies.ModuleServiceProxy,
        ApiServiceProxies.DataDictionaryServiceProxy,
        ApiServiceProxies.EnumDescriptionServiceProxy,
        ApiServiceProxies.BrandServiceProxy,
        ApiServiceProxies.InstrumentServiceProxy,
        ApiServiceProxies.VendorServiceProxy,
        ApiServiceProxies.WarehouseInfoServiceProxy,
        ApiServiceProxies.StorageLocationServiceProxy,
        ApiServiceProxies.InspectionItemServiceProxy,
        ApiServiceProxies.MaterialServiceProxy,
        ApiServiceProxies.BarcodePrintRecordServiceProxy,
        ApiServiceProxies.ApprovalWorkflowServiceProxy,
        ApiServiceProxies.MaterialPurchaseServiceProxy,
        ApiServiceProxies.MaterialStorageServiceProxy,
        ApiServiceProxies.MaterialStockServiceProxy,
        ApiServiceProxies.MaterialOutStorageServiceProxy,
        ApiServiceProxies.MaterialRequestServiceProxy,
        ApiServiceProxies.MaterialInventoryServiceProxy,
        ApiServiceProxies.TenantSettingsServiceProxy,
        ApiServiceProxies.ApprovalRecordServiceProxy,
        ApiServiceProxies.WarningServiceProxy,
        ApiServiceProxies.FocusInfomationServiceProxy,
        ApiServiceProxies.PerformanceVerificationServiceProxy,
        ApiServiceProxies.PerformanceVerificationReportServiceProxy,
        ApiServiceProxies.AuditLogServiceProxy,
        ApiServiceProxies.CachingServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class ServiceProxyModule { }
