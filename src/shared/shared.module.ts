import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AbpModule } from '@abp/abp.module';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import {FormatOrganizationUnitIdPipe} from '@shared/pipes/formatOrganizationUnitId';
import {FormatUserPipe} from '@shared/pipes/formatUser.pipe';
import {FormatValueToNamePipe} from '@shared/pipes/formatValueToName';
import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { AbpPaginationControlsComponent } from './pagination/abp-pagination-controls.component';
import {DatePipe} from '@angular/common';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { EnumTypePipe } from '@shared/pipes/enumType.pipe';
import {JoinPipe} from '@shared/pipes/join.pipe';
import {ArrayFilter} from '@shared/pipes/arrayFilter.pipe';
import {FormatBooleanPipe} from '@shared/pipes/formatBoolean.pipe';
import {WebSettingService} from '@app/layout/webSettingService';
import { LodopService } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';
import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
} from '@angular/material';
import { BlockDirective } from './directives/block.directive';
import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';
@NgModule({
    imports: [
        CommonModule,
        AbpModule,
        RouterModule,
        NgxPaginationModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
    ],
    declarations: [
        AbpPaginationControlsComponent,
        LocalizePipe,
        BlockDirective,
        BusyDirective,
        EqualValidator,
        FormatOrganizationUnitIdPipe,
        FormatValueToNamePipe,
        ArrayFilter,
        JoinPipe,
        FormatBooleanPipe,
        FormatUserPipe,
        EnumTypePipe
    ],

    exports: [
        FormatOrganizationUnitIdPipe,
        FormatValueToNamePipe,
        ArrayFilter,
        JoinPipe,
        FormatBooleanPipe,
        EnumTypePipe,
        FormatUserPipe,
        AbpPaginationControlsComponent,
        LocalizePipe,
        BlockDirective,
        BusyDirective,
        EqualValidator,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        ScrollingModule,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                DatePipe,
                FormatOrganizationUnitIdPipe,
                WebSettingService,
                LodopService,
                NzMessageService,
                ArrayFilter
            ]
        };
    }
}
