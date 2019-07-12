import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';


import { LayoutComponent } from '@app/layout/layout.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { UsersComponent } from './userManager/users/users.component';

import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from './home/home.component';
import { JsonpModule } from '@angular/http';
import { AbpModule } from '@abp/abp.module';
import { ModalModule } from 'ngx-bootstrap';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RolesComponent } from './userManager/roles/roles.component';
import { RoleEditComponent } from './userManager/roles/role-edit/role-edit.component';
import { OrganizationUnitsComponent } from './userManager/organization-units/organization-units.component';
import { OrganizationUnitsEditComponent } from './userManager/organization-units/organization-units-edit/organization-units-edit.component';
import { OrganizationUnitsUsersComponent } from './userManager/organization-units/organization-units-users/organization-units-users.component';
import { UsersEditComponent } from './userManager/users/users-edit/users-edit.component';
import { ModuleComponent } from './userManager/module/module.component';
import { ModuleEditComponent } from './userManager/module/module-edit/module-edit.component';
import { DataDictionaryComponent } from './systemSetting/data-dictionary/data-dictionary.component';
import { EnumDictionaryComponent } from './systemSetting/enum-dictionary/enum-dictionary.component';
import { EnumDictionaryEditComponent } from './systemSetting/enum-dictionary/enum-dictionary-edit/enum-dictionary-edit.component';
import { DataDictionaryEditComponent } from './systemSetting/data-dictionary/data-dictionary-edit/data-dictionary-edit.component';
import { BrandComponent } from './basicInfo/brand/brand.component';
import { BrandEditComponent } from './basicInfo/brand/brand-edit/brand-edit.component';
import { InstrumentComponent } from './basicInfo/instrument/instrument.component';
import { InstrumentEditComponent } from './basicInfo/instrument/instrument-edit/instrument-edit.component';
import { VendorComponent } from './basicInfo/vendor/vendor.component';
import { VendorEditComponent } from './basicInfo/vendor/vendor-edit/vendor-edit.component';
import { WarehouseComponent } from './basicInfo/warehouse/warehouse.component';
import { WarehouseEditComponent } from './basicInfo/warehouse/warehouse-edit/warehouse-edit.component';
import { StorageLocationComponent } from './basicInfo/storage-location/storage-location.component';
import { StorageLocationEditComponent } from './basicInfo/storage-location/storage-location-edit/storage-location-edit.component';
import { InspectionItemComponent } from './basicInfo/inspection-item/inspection-item.component';
import { InspectionItemEditComponent } from './basicInfo/inspection-item/inspection-item-edit/inspection-item-edit.component';
import { MaterialComponent } from './basicInfo/material/material.component';
import { MaterialEditComponent } from './basicInfo/material/material-edit/material-edit.component';
import { MaterialInspectionItemComponent } from './basicInfo/material/material-inspection-item/material-inspection-item.component';

import { MaterialPrintComponent } from './print/material-print/material-print.component';
import { PrintRecordsComponent } from './print/print-records/print-records.component';
import { PrintRecordsDetailComponent } from './print/print-records/print-records-detail/print-records-detail.component';
import { ApprovalWorkflowComponent } from './approval/approval-workflow/approval-workflow.component';
import { ApprovalWorkflowEditComponent } from './approval/approval-workflow/approval-workflow-edit/approval-workflow-edit.component';
import { PurchaseApplyComponent } from './purchase/purchase-apply/purchase-apply.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { OtherStorageComponent } from './storage/other-storage/other-storage.component';
import { PurchaseStorageComponent } from './storage/purchase-storage/purchase-storage.component';
import { StorageListComponent } from './storage/storage-list/storage-list.component';
import { MaterialScanComponent } from './common/material-scan/material-scan.component';
import { PurchaseApprovalComponent } from './purchase/purchase-approval/purchase-approval.component';
import { OutStorageUseComponent } from './outStorage/out-storage-use/out-storage-use.component';
import { PurchasePrintComponent } from './print/purchase-print/purchase-print.component';
import { OutStorageListComponent } from './outStorage/out-storage-list/out-storage-list.component';
import { OutStoragePurchaseComponent } from './outStorage/out-storage-purchase/out-storage-purchase.component';
import { QueryConditionComponent } from './common/query-condition/query-condition.component';
import { MaterialRequestComponent } from './request/material-request/material-request.component';
import { MaterialRequestApprovalComponent } from './request/material-request-approval/material-request-approval.component';
import { MaterialRequestListComponent } from './request/material-request-list/material-request-list.component';
import { MaterialRequestOutStorageComponent } from './request/material-request-out-storage/material-request-out-storage.component';
import { InventoryQueryComponent } from './inventory/inventory-query/inventory-query.component';
import { InventoryCreateComponent } from './inventory/inventory-create/inventory-create.component';
import { InventoryWaitingListComponent } from './inventory/inventory-waiting-list/inventory-waiting-list.component';
import { InventoryCheckComponent } from './inventory/inventory-check/inventory-check.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { SettingComponent } from './systemSetting/setting/setting.component';
import { ApprovalDrawerComponent } from './common/approval-drawer/approval-drawer.component';
import { StockValidityWarningComponent } from './warning/stock-validity-warning/stock-validity-warning.component';
import { MaterialUnArrivedWarningComponent } from './warning/material-un-arrived-warning/material-un-arrived-warning.component';
import { MaterialStockWarningComponent } from './warning/material-stock-warning/material-stock-warning.component';
import { CertificateExpirationWarningComponent } from './warning/certificate-expiration-warning/certificate-expiration-warning.component';
import { MaterialBarcodesComponent } from './common/material-barcodes/material-barcodes.component';
import { MaterialsSelectComponent } from './common/materials-select/materials-select.component';


import { BannerColumnChangerComponent } from './common/banner-column-changer/banner-column-changer.component';
import { OrganizationUnitsSettingComponent } from './userManager/organization-units/organization-units-setting/organization-units-setting.component';
import { VerificationWatingComponent } from './verification/verification-wating/verification-wating.component';
import { VerificationListComponent } from './verification/verification-list/verification-list.component';
import { VerificationComponent } from './verification/verification/verification.component';
import { LogsComponent } from './systemSetting/logs/logs.component';
import { MaintenanceComponent } from './systemSetting/maintenance/maintenance.component';
import { OutstorageOrdersComponent } from './outStorage/outstorage-orders/outstorage-orders.component';
import { StorageOrdersComponent } from './storage-orders/storage-orders.component';
const LayoutComponents = [
  LayoutComponent,
  HeaderComponent,
  SidebarComponent
];

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ...LayoutComponents,
    UsersComponent,
    RolesComponent,
    RoleEditComponent,
    OrganizationUnitsComponent,
    OrganizationUnitsEditComponent,
    OrganizationUnitsUsersComponent,
    UsersEditComponent,
    ModuleComponent,
    ModuleEditComponent,
    DataDictionaryComponent,
    EnumDictionaryComponent,
    EnumDictionaryEditComponent,
    DataDictionaryEditComponent,
    BrandComponent,
    BrandEditComponent,
    InstrumentComponent,
    InstrumentEditComponent,
    VendorComponent,
    VendorEditComponent,
    WarehouseComponent,
    WarehouseEditComponent,
    StorageLocationComponent,
    StorageLocationEditComponent,
    InspectionItemComponent,
    InspectionItemEditComponent,
    MaterialComponent,
    MaterialEditComponent,
    MaterialInspectionItemComponent,
    MaterialPrintComponent,
    PrintRecordsComponent,
    PrintRecordsDetailComponent,
    ApprovalWorkflowComponent,
    ApprovalWorkflowEditComponent,
    PurchaseApplyComponent,
    PurchaseListComponent,
    OtherStorageComponent,
    PurchaseStorageComponent,
    StorageListComponent,
    MaterialScanComponent,
    PurchaseApprovalComponent,
    OutStorageUseComponent,
    PurchasePrintComponent,
    OutStorageListComponent,
    OutStoragePurchaseComponent,
    QueryConditionComponent,
    MaterialRequestComponent,
    MaterialRequestApprovalComponent,
    MaterialRequestListComponent,
    MaterialRequestOutStorageComponent,
    InventoryQueryComponent,
    InventoryCreateComponent,
    InventoryWaitingListComponent,
    InventoryCheckComponent,
    InventoryListComponent,
    SettingComponent,
    ApprovalDrawerComponent,
    StockValidityWarningComponent,
    MaterialUnArrivedWarningComponent,
    MaterialStockWarningComponent,
    CertificateExpirationWarningComponent,
    MaterialBarcodesComponent,
    MaterialsSelectComponent,
    BannerColumnChangerComponent,
    OrganizationUnitsSettingComponent,
    VerificationWatingComponent,
    VerificationListComponent,
    VerificationComponent,
    LogsComponent,
    MaintenanceComponent,
    OutstorageOrdersComponent,
    StorageOrdersComponent



  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    JsonpModule,
    ModalModule.forRoot(),
    AbpModule,
    ServiceProxyModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgZorroAntdModule.forRoot()

  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  entryComponents: []

})
export class AppModule { }










