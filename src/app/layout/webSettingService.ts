import { Injectable } from '@angular/core';
import { LodopService, Lodop, LodopConfig } from '@delon/abc';
import {
    UserServiceProxy, UserListDto,TenantSettingsServiceProxy,TenantSettingsEditDto
} from '@shared/service-proxies/service-proxies';
@Injectable()
export class WebSettingService {

    static readonly twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';
    isCollapsed: boolean = false;
    bannerLeft: number = 7;
    bannerRight: number = 17;
    users: UserListDto[] = [];
    lodop: Lodop;
    settings:TenantSettingsEditDto;
    constructor(
        private userServiceProxy: UserServiceProxy,
        private lodopService: LodopService,
        private tenantSettingsServiceProxy:TenantSettingsServiceProxy
    ) {
        this.getUsers();
        this.lodopInit();
        this.getWebSettings();
    }


    public toggle(): void {
        console.log('webSetting');
        this.isCollapsed = !this.isCollapsed;
    }
    public bannerChange(left: number): void {
        this.bannerLeft = left;
        this.bannerRight = 24 - this.bannerLeft;
    }
    private getUsers(): void {
        this.userServiceProxy.getUserList().subscribe((result: UserListDto[]) => {
            this.users = result;
        });
    }
    private getWebSettings(): void {
        this.tenantSettingsServiceProxy.getAllSettings().subscribe((result:TenantSettingsEditDto)=>{
            this.settings=result;
        })
    }

    lodopInit(): void {
        var adLodopConfig = new LodopConfig();
        adLodopConfig.url = "http://127.0.0.1:8000/CLodopfuncs.js";
        adLodopConfig.companyName = "上海红爵信息科技发展有限公司";
        adLodopConfig.license = "1AD1F3BDC26B8A56138F46683237E0FF";
        this.lodopService.cog = adLodopConfig;
        this.lodopService.lodop.subscribe(({ lodop, ok }) => {
            if (!ok) {
                return;
            }
            this.lodop = lodop as Lodop;
        });
    }
    private printBarcode(printModel):void{
        console.log('printBarcode');
        
        var org = '';
        if (printModel.material.isPublicReagent) {
            org = '公共试剂';
        } else {
            org = printModel.material.organizationMaterials && printModel.material.organizationMaterials.lenth > 0 ? printModel.material.organizationMaterials[0].organizationName : '';
        }
        this.lodop.PRINT_INIT('预置条码打印');
        this.lodop.SET_PRINT_STYLE('FontSize', 8);
        this.lodop.SET_PRINT_STYLE('FontName', '微软雅黑');
        this.lodop.ADD_PRINT_TEXT('2mm', '2mm', '46mm', '3mm', printModel.name);
        this.lodop.SET_LICENSES('上海红爵信息科技发展有限公司', '1AD1F3BDC26B8A56138F46683237E0FF', '', '');
        this.lodop.ADD_PRINT_BARCODE('6mm', '2mm', '46mm', '8mm', '128Auto', printModel.code);
        this.lodop.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
        this.lodop.SET_PRINT_STYLE('FontSize', 7);
        this.lodop.ADD_PRINT_TEXT('15mm', '2mm', '50mm', '3mm', printModel.code);
        this.lodop.ADD_PRINT_TEXT('19mm', '2mm', '50mm', '3mm', '效期：' + printModel.expiryDate);
        this.lodop.ADD_PRINT_TEXT('19mm', '26mm', '50mm', '3mm', '部门：' + org);
        this.lodop.ADD_PRINT_TEXT('23mm', '2mm', '50mm', '3mm', '规格：' + printModel.material.specification);
        this.lodop.ADD_PRINT_TEXT('23mm', '26mm', '50mm', '3mm', '存储条件：' + printModel.material.storageConditionName);
        this.lodop.ADD_PRINT_TEXT('26mm', '2mm', '50mm', '3mm', '批次号：' + printModel.batchNo);
        this.lodop.PRINT();
    }
    private printQRCode(printModel):void{
 
        console.log('printQRCode');
        console.log(printModel.code);
        printModel.serialNumber=printModel.code.substr(printModel.code.length-6,6);
        console.log('printModel.serialNumber');
        console.log(printModel.serialNumber);
        this.lodop.PRINT_INIT('预置条码打印');
        this.lodop.SET_LICENSES('上海红爵信息科技发展有限公司', '1AD1F3BDC26B8A56138F46683237E0FF', '','');
        this.lodop.SET_PRINT_STYLE('FontSize', 9);
        this.lodop.SET_PRINT_STYLE('FontName', '微软雅黑');
        this.lodop.ADD_PRINT_BARCODE('1.5mm', '4mm', '20mm', '20mm', 'QRCode', printModel.code);
        this.lodop.SET_PRINT_STYLEA(0, 'ShowBarText', 0);
        this.lodop.ADD_PRINT_TEXT('1.5mm', '25mm', '50mm', '3mm',printModel.expiryDate);
        this.lodop.ADD_PRINT_TEXT('7mm', '25mm', '50mm', '3mm',printModel.batchNo);
        this.lodop.ADD_PRINT_TEXT('13mm', '25mm', '50mm', '3mm',printModel.serialNumber);
        this.lodop.SET_PRINT_STYLE('FontSize', 8);
        this.lodop.ADD_PRINT_TEXT('20mm', '4mm', '47mm', '3mm',printModel.name);
        this.lodop.PRINT();
    }
    printService(printModel): void {

        if(this.settings.inventory.isEnableBarcode){
            this.printBarcode(printModel);
        }else{
            this.printQRCode(printModel);
        }


      
    }
}
