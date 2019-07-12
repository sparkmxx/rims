import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './userManager/users/users.component';
import { RolesComponent } from './userManager/roles/roles.component';
import { OrganizationUnitsComponent } from './userManager/organization-units/organization-units.component';
import { ModuleComponent } from './userManager/module/module.component';
import { EnumDictionaryComponent } from './systemSetting/enum-dictionary/enum-dictionary.component';
import { DataDictionaryComponent } from './systemSetting/data-dictionary/data-dictionary.component';
import { BrandComponent } from './basicInfo/brand/brand.component';
import { InstrumentComponent } from './basicInfo/instrument/instrument.component';
import { VendorComponent } from './basicInfo/vendor/vendor.component';
import { WarehouseComponent } from './basicInfo/warehouse/warehouse.component';
import { StorageLocationComponent } from './basicInfo/storage-location/storage-location.component';
import { InspectionItemComponent } from './basicInfo/inspection-item/inspection-item.component';
import { MaterialComponent } from './basicInfo/material/material.component';
import { MaterialPrintComponent } from './print/material-print/material-print.component';
import { PrintRecordsComponent } from './print/print-records/print-records.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ApprovalWorkflowComponent } from './approval/approval-workflow/approval-workflow.component';
import { PurchaseApplyComponent } from './purchase/purchase-apply/purchase-apply.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { PurchaseApprovalComponent } from './purchase/purchase-approval/purchase-approval.component';
import { OtherStorageComponent } from './storage/other-storage/other-storage.component';
import { PurchaseStorageComponent } from './storage/purchase-storage/purchase-storage.component';
import { StorageListComponent } from './storage/storage-list/storage-list.component';
import { OutStorageUseComponent } from './outStorage/out-storage-use/out-storage-use.component';
import { PurchasePrintComponent } from './print/purchase-print/purchase-print.component';
import { OutStorageListComponent } from './outStorage/out-storage-list/out-storage-list.component';
import { OutStoragePurchaseComponent } from './outStorage/out-storage-purchase/out-storage-purchase.component';

import { MaterialRequestComponent } from './request/material-request/material-request.component';
import { MaterialRequestApprovalComponent } from './request/material-request-approval/material-request-approval.component';
import { MaterialRequestListComponent } from './request/material-request-list/material-request-list.component';
import { MaterialRequestOutStorageComponent } from './request/material-request-out-storage/material-request-out-storage.component';

import { InventoryQueryComponent } from './inventory/inventory-query/inventory-query.component';
import { InventoryCreateComponent } from './inventory/inventory-create/inventory-create.component';
import { InventoryWaitingListComponent } from './inventory/inventory-waiting-list/inventory-waiting-list.component';
import { InventoryCheckComponent } from './inventory/inventory-check/inventory-check.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';


import { VerificationWatingComponent } from './verification/verification-wating/verification-wating.component';
import { VerificationListComponent } from './verification/verification-list/verification-list.component';
import { VerificationComponent } from './verification/verification/verification.component';
import { LogsComponent } from './systemSetting/logs/logs.component';
import { MaintenanceComponent } from './systemSetting/maintenance/maintenance.component';

import { OutstorageOrdersComponent } from './outStorage/outstorage-orders/outstorage-orders.component';
import { StorageOrdersComponent } from './storage-orders/storage-orders.component';
@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: AppComponent,
      canActivate: [AppRouteGuard],
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'userManager/users', component: UsersComponent, canActivate: [AppRouteGuard] },
        { path: 'userManager/roles', component: RolesComponent, canActivate: [AppRouteGuard] },
        { path: 'userManager/organizationUnits', component: OrganizationUnitsComponent, canActivate: [AppRouteGuard] },
        { path: 'userManager/module', component: ModuleComponent, canActivate: [AppRouteGuard] },
        { path: 'systemSetting/dataDictionary', component: DataDictionaryComponent, canActivate: [AppRouteGuard] },
        { path: 'systemSetting/enumDictionary', component: EnumDictionaryComponent, canActivate: [AppRouteGuard] },
        { path: 'systemSetting/logs', component: LogsComponent, canActivate: [AppRouteGuard] },
        { path: 'systemSetting/tenance', component: MaintenanceComponent, canActivate: [AppRouteGuard] },

        { path: 'basic/brand', component: BrandComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/instrument', component: InstrumentComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/vendor', component: VendorComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/warehouse', component: WarehouseComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/storageLocation', component: StorageLocationComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/inspectionItem', component: InspectionItemComponent, canActivate: [AppRouteGuard] },
        { path: 'basic/material', component: MaterialComponent, canActivate: [AppRouteGuard] },
        { path: 'print/material', component: MaterialPrintComponent, canActivate: [AppRouteGuard] },
        { path: 'print/records', component: PrintRecordsComponent, canActivate: [AppRouteGuard] },
        { path: 'print/purchase', component: PurchasePrintComponent, canActivate: [AppRouteGuard] },
        { path: 'approval/workflow', component: ApprovalWorkflowComponent, canActivate: [AppRouteGuard] },
        { path: 'purchase/apply', component: PurchaseApplyComponent, canActivate: [AppRouteGuard] },
        { path: 'purchase/list', component: PurchaseListComponent, canActivate: [AppRouteGuard] },
        { path: 'purchase/approval', component: PurchaseApprovalComponent, canActivate: [AppRouteGuard] },
        { path: 'storage/other', component: OtherStorageComponent, canActivate: [AppRouteGuard] },
        { path: 'storage/purchase', component: PurchaseStorageComponent, canActivate: [AppRouteGuard] },
        { path: 'storage/list', component: StorageListComponent, canActivate: [AppRouteGuard] },
        { path: 'storage/orders', component: StorageOrdersComponent, canActivate: [AppRouteGuard] },
        { path: 'outStorage/use', component: OutStorageUseComponent, canActivate: [AppRouteGuard] },
        { path: 'outStorage/list', component: OutStorageListComponent, canActivate: [AppRouteGuard] },
        { path: 'outStorage/purchase', component: OutStoragePurchaseComponent, canActivate: [AppRouteGuard] },
        { path: 'outStorage/orders', component: OutstorageOrdersComponent, canActivate: [AppRouteGuard] },
        
        { path: 'request/request', component: MaterialRequestComponent, canActivate: [AppRouteGuard] },
        { path: 'request/approval', component: MaterialRequestApprovalComponent, canActivate: [AppRouteGuard] },
        { path: 'request/list', component: MaterialRequestListComponent, canActivate: [AppRouteGuard] },
        { path: 'request/outStorage', component: MaterialRequestOutStorageComponent, canActivate: [AppRouteGuard] },

        { path: 'inventory/query', component: InventoryQueryComponent, canActivate: [AppRouteGuard] },
        { path: 'inventory/create', component: InventoryCreateComponent, canActivate: [AppRouteGuard] },
        { path: 'inventory/waiting', component: InventoryWaitingListComponent, canActivate: [AppRouteGuard] },
        { path: 'inventory/check/:id', component: InventoryCheckComponent, canActivate: [AppRouteGuard] },
        { path: 'inventory/list', component: InventoryListComponent, canActivate: [AppRouteGuard] },


        { path: 'verificat/wating', component: VerificationWatingComponent, canActivate: [AppRouteGuard] },
        { path: 'verificat/list', component: VerificationListComponent, canActivate: [AppRouteGuard] },

        { path: 'verificat/verificat/:id/:type/:?insId', component: VerificationComponent, canActivate: [AppRouteGuard] }
       
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
