import { Component, EventEmitter, Injector, OnInit, Output,ViewChild } from '@angular/core';
import {
  MaterialServiceProxy, GetMaterialForEditOutput, CreateOrUpdateMaterialInput, VendorServiceProxy, GetVendorListOutput,
  OrganizationUnitServiceProxy,
  ListResultDtoOfOrganizationUnitDto,
  DataDictionaryServiceProxy,
  DataDictionaryDto,
  BrandServiceProxy,
  GetBrandListOutput,
  OrganizationMaterialDto,
  MaterialOutInStorageDto,
  GetInspectionItemPaginationOutput,
  PerformanceVerificationMaterialDto,
  InstrumentServiceProxy,
  GetInstrumentListOutput

} from '@shared/service-proxies/service-proxies';
import { NzMessageService } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode,UploadFile } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { MaterialInspectionItemComponent} from '../material-inspection-item/material-inspection-item.component';
import { idLocale } from 'ngx-bootstrap';
import {ArrayFilter} from '@shared/pipes/arrayFilter.pipe';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.less']
})

export class MaterialEditComponent extends AppComponentBase implements OnInit {

  @ViewChild('materialInspectionItemModal') materialInspectionItemModal: MaterialInspectionItemComponent;

  saveDto: CreateOrUpdateMaterialInput = new CreateOrUpdateMaterialInput();
  isVisible = false;
  saving = false;
  validateForm: FormGroup;
  treeNodes: NzTreeNode[] = [];
  organizations=[];
  organizationUnitIds: number[] = [];
  dicts = {};
  vendors:any={ Manufacturer:[],Supplier:[],DeliveryCompany:[],InvoicingCompany:[]};
  brands:any[]=[];
  instruments:any[]=[];
  loading = false;
  inspectionItemState=false;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
  tempDict=[];
  inStorageDetails:any[]=[];
  outStorageDetails:any[]=[];
  constructor(private materialServiceProxy: MaterialServiceProxy,
    private vendorServiceProxy: VendorServiceProxy,
    private organizationUnitServiceProxy: OrganizationUnitServiceProxy,
    private FormatOrganizationUnitIdPipe:FormatOrganizationUnitIdPipe,
    private dataDictionaryServiceProxy:DataDictionaryServiceProxy,
    private instrumentServiceProxy:InstrumentServiceProxy,
    private brandServiceProxy:BrandServiceProxy,
    private injector: Injector,
    private messageService: NzMessageService,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      hospitalMaterialCode: [null, [Validators.required]],
      systemMaterialCode: [null, [Validators.required]],
      specification: [null, [Validators.required]],
      storageConditionId: [null, [Validators.required]],
      temperatureRangeId: [null, [Validators.required]],
      materialTypeId: [null, [Validators.required]],
      brandId: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      minUnitId: [null, [Validators.required]],
      organizationUnitIds: [null, [Validators.required]],
      unitConvertRate: null,
      registrationCertificateFilePath: null,
      expiryDate: null,
      registrationCertificateNo: null,
      isRegistrationCertificate: null,
      outBoxExpiryDate: null,
      deliveryCompanyId: null,
      invoicingCompanyId: null,
      manufacturerId:null,
      supplierId: null,
      price: null,
      shortName: null,
      instrumentId: null,
      methodologyId: null,
      isDisabled: null,
      disabledDate: null,
      disabledReasonId: null,
      vendorMaterialCode: null,
      isStopPurchase: null,
      isAutoGenerateUniqueCode: null,
      isEnableOpenLabel: null,
      isHavePpCertificate: null,
      isPublicReagent: null,
      isCombinationReagent: null,
      isInventoryAlert: null,
      alertMaterialNumber: null,
      alertMinMaterialNumber: null,
      isAvailableDayAlert: null,
      alertAvailableDay: null,
      alertMinAvailableDay: null,
      isAutoPurchaseCalculate: null,
      monthPurchaseUpperLimit: null,
      isDefaultPurchaseNumber: null,
      defaultPurchaseNumber: null,
      materialOutInStorages:null,
      isPerformanceVerification:null
    });
    this.saveDto.materialOutInStorages=[];
    this.saveDto.organizationMaterials=[];
    this.saveDto.performanceVerificationMaterials=[];
    this.inStorageDetails=[];
    this.outStorageDetails=[];
  }
  nzScrollhh(e:any):void{
    console.log(e);
  }

  uploadComplete(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.loading = false;
        var pathArray = info.file.response.result.path.split("\\")
        var fileName = pathArray[pathArray.length - 1];

        this.saveDto.registrationCertificateFilePath=info.file.response.result.path;

        break;
      case 'error':
        this.nzMessage.error('上传失败');
        this.loading = false;
        break;
    }
  }
  show(id?: string | undefined): void {
    this.saveDto = new CreateOrUpdateMaterialInput();
    this.saveDto.materialOutInStorages=[];
    this.saveDto.organizationMaterials=[];
    this.saveDto.performanceVerificationMaterials=[];
    this.organizationUnitIds=[];
    this.inStorageDetails=[];
    this.outStorageDetails=[];
    if (id) {
      this.loading = true;
      this.materialServiceProxy.getMaterialForEdit(id)
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((result: GetMaterialForEditOutput) => {
          this.saveDto.init(result);
          this.organizationUnitIds=result.organizationMaterials.map(d=>d.organizationId);
          this.getTempDict();
          if(result.unitConvertSetting){
            const setting=JSON.parse(result.unitConvertSetting);
            this.inStorageDetails=setting.inStorageDetails;
            this.outStorageDetails=setting.outStorageDetails;
          }
          
        });
    }
    this.getList();
    this.getDictionary();
    this.isVisible = true;
  }
  getList(): void {
    this.vendorServiceProxy.getVendorList(undefined, undefined).subscribe((result: GetVendorListOutput[]) => {
      result.forEach((d)=>{
        let b={ name: d.name, value: d.id };
          switch (d.vendorType){
            case this.enumObject.VendorType.Manufacturer:
              this.vendors['Manufacturer'].push(b);
              break;
              case this.enumObject.VendorType.Supplier:
              this.vendors['Supplier'].push(b);
              break;
              case this.enumObject.VendorType.DeliveryCompany:
              this.vendors['DeliveryCompany'].push(b);
              break;
              case this.enumObject.VendorType.InvoicingCompany:
              this.vendors['InvoicingCompany'].push(b);
              break;
          }
      });
    
    });
    this.brandServiceProxy.getBrandList().subscribe((result: GetBrandListOutput[])=>{
        this.brands=result.map((d) => {
          return { name: d.name, value: d.id };
        });
    });
    this.instrumentServiceProxy.getInstrumentList().subscribe((result: GetInstrumentListOutput[])=>{
      this.instruments=result.map((d) => {
        return { name: d.name, value: d.id };
      });
  })
    //brandServiceProxy
    this.organizationUnitServiceProxy.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizations = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizations);
    });
  }
  getDictionary():void{
    this.dataDictionaryServiceProxy.getDataDictionaryValues([
      this.enumObject.DictType.StorageCondition,
      this.enumObject.DictType.StorageConditionFreezing,
      this.enumObject.DictType.StorageConditionRefrigeration,
      this.enumObject.DictType.StorageConditionCool,
      this.enumObject.DictType.StorageConditionNormalTemperature,
      this.enumObject.DictType.StorageConditionOther,
      this.enumObject.DictType.MaterialType,
      this.enumObject.DictType.MaterialUnit,
      this.enumObject.DictType.DisabledReason,
      this.enumObject.DictType.InspectResultType,
      this.enumObject.DictType.MethodologyType]).subscribe((result: DataDictionaryDto[]) => {
      result.forEach((d)=>{
        this.dicts[d.dictType]=d.dataDictionaryDetails.map((d)=>{
          d.value=d.id;
          return d;
        });
        this.getTempDict();
      });
    });
  }
  storageConditionChange(e):void{
    if(e){
      const condition=this.dicts[this.enumObject.DictType.StorageCondition].find(d=>d.value===e);
      if(condition){
          this.tempDict=this.dicts[condition.childDictType];
      }else{
        this.tempDict=[];
      }
    }else{
      this.tempDict=[];
    }
   
    this.selectKeyToName(this.dicts[this.enumObject.DictType.StorageCondition],this.saveDto,'storageConditionId','storageConditionName')
  }
  save(): void {
    //this.saveDto.organizationId = Number(this.organizationUnitId);
    //this.saveDto.organizationName = this.FormatOrganizationUnitIdPipe.transform(this.saveDto.organizationId, this.organizations);
   
    this.saveDto.organizationMaterials=this.organizationUnitIds.map((d)=>{
      const org=new OrganizationMaterialDto();
      org.organizationId=Number(d);
      org.organizationName=this.FormatOrganizationUnitIdPipe.transform(org.organizationId, this.organizations);
      return org;
    });
    console.log(this.inStorageDetails);
    let setting={
      inStorageDetails:this.inStorageDetails.map(d=>{
        return {
          unitId:d.unitId,
          unitName:d.unitName,
          multiple:d.multiple
        }
      }),
      outStorageDetails:this.outStorageDetails.map(d=>{
        return {
          unitId:d.unitId,
          unitName:d.unitName,
          multiple:d.multiple
        }
      })
    }

    

    this.saveDto.unitConvertSetting=JSON.stringify(setting);
    this.saving = true;

    this.materialServiceProxy.createOrUpdateMaterial(this.saveDto)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe(() => {
        this.modalSave.emit(null);
        this.close();
        this.messageService.create('success', `保存成功`);
      });
  }

  close(): void {
    this.isVisible = false;
  }
  getTempDict():void{
    if(this.saveDto.storageConditionId&&this.dicts[this.enumObject.DictType.StorageCondition]&&this.dicts[this.enumObject.DictType.StorageCondition].length>0){
        const d=this.dicts[this.enumObject.DictType.StorageCondition].find(d=>d.value===this.saveDto.storageConditionId);
        this.tempDict=this.dicts[d.childDictType];
    }
  }

  addStorages():void{
    const storage=new MaterialOutInStorageDto();
    storage.outInStorageType=this.enumObject.OutInStorageType.In;
    this.saveDto.materialOutInStorages=[...this.saveDto.materialOutInStorages,storage];
  }
  addOutStorages():void{
    const out=new MaterialOutInStorageDto();
    out.outInStorageType=this.enumObject.OutInStorageType.Out;
    this.saveDto.materialOutInStorages=[...this.saveDto.materialOutInStorages,out];
  }
  deleteStorageSetting(dto:MaterialOutInStorageDto,type:number):void{
    this.saveDto.materialOutInStorages=this.saveDto.materialOutInStorages.filter(d=>d!==dto);
    this. mapUnitsTransformData(type);
  }
  mapUnitsTransformData(type:number):void{
    let storageUnits=this.saveDto.materialOutInStorages.filter(d=>d.outInStorageType===this.enumObject.OutInStorageType.In&&d.unitId);
    let outStorageUnits=this.saveDto.materialOutInStorages.filter(d=>d.outInStorageType===this.enumObject.OutInStorageType.Out&&d.unitId);
    
    
    if(storageUnits&&storageUnits.length>1&&type===this.enumObject.OutInStorageType.In){
      this.inStorageDetails=[];
      storageUnits.forEach(d=>{
        let t=this.inStorageDetails.find(e=>e.unitId===d.unitId);
        if(!t){
          this.inStorageDetails=[...this.inStorageDetails,d];
        }
      });
    }
    if(outStorageUnits&&outStorageUnits.length>1&&type===this.enumObject.OutInStorageType.Out){
      this.outStorageDetails=[];
      outStorageUnits.forEach(d=>{
        let t=this.outStorageDetails.find(e=>e.unitId===d.unitId);
        if(!t){
          this.outStorageDetails=[...this.outStorageDetails,d];
        }
      });
    }
  }

  clearInStorageDetails():void{
    this.inStorageDetails=[];
  }
  clearOutStorageDetails():void{
    this.outStorageDetails=[];
  }
  unitTransformChange(item:MaterialOutInStorageDto,type:number):void{
    
    setTimeout(()=>{
      this.mapUnitsTransformData(type);
    });
    this.selectKeyToName(this.dicts[this.enumObject.DictType.MaterialUnit],item,'unitId','unitName');
  }
  inspectionItemOpen():void{
    this.materialInspectionItemModal.show(this.saveDto.performanceVerificationMaterials);
  }
  deletePerformanceVerificationMaterials(item:PerformanceVerificationMaterialDto):void{
    this.saveDto.performanceVerificationMaterials=this.saveDto.performanceVerificationMaterials.filter(d=>d!==item);
  }
  saveInspectionItem(checkeds:GetInspectionItemPaginationOutput[]):void{
    checkeds.forEach((d)=>{
      
      const ins=this.saveDto.performanceVerificationMaterials.find(t=>t.inspectionItemId===d.id);
      if(!ins){
        const item= new PerformanceVerificationMaterialDto();
        item.init(d);
        item.inspectionItemId=d.id;
        item.inspectionItemName=d.name;
        this.saveDto.performanceVerificationMaterials=[...this.saveDto.performanceVerificationMaterials,item];
      }
    })
    
  }
}
