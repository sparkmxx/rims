import { Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {
  PerformanceVerificationReportServiceProxy, PerformanceVerificationServiceProxy, GetPerformanceVerificationInfoOutput, CreateOrUpdatePerformanceVerificationReportInput, InstrumentServiceProxy, GetInstrumentListOutput, CreatePerformanceVerificationReportInspectItemDto, CreatePerformanceVerificationReportMaterialDto, CreatePerformanceVerificationReportTestResultDto,GetPerformanceVerificationReportForEditOutput,DataDictionaryServiceProxy,
  DataDictionaryDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.less']
})
export class VerificationComponent extends AppComponentBase implements OnInit {
  loading = false;
  filter = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  id: string;
  input: CreateOrUpdatePerformanceVerificationReportInput = new CreateOrUpdatePerformanceVerificationReportInput();
  instruments: any[] = [];
  user:string;
  isListView=false;
  dicts=[];
  constructor(private performanceVerificationServiceProxy: PerformanceVerificationServiceProxy,
    private performanceVerificationReportServiceProxy: PerformanceVerificationReportServiceProxy,
    private instrumentServiceProxy: InstrumentServiceProxy,
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private nzMessageService: NzMessageService,
    private dataDictionaryServiceProxy:DataDictionaryServiceProxy,
    private router: Router,
    private location:Location
  ) {
    super(injector);

  }

  list(): void {
    this.loading = true;
    this.performanceVerificationServiceProxy.getPerformanceVerificationInfo(this.id, undefined)
      .pipe(finalize(() => {
      }))
      .subscribe((result: GetPerformanceVerificationInfoOutput) => {
        this.loading = false;
        this.input.qualifiedVerifyReportInspectItems = result.inspectionItems.map((a) => {
          let dto = new CreatePerformanceVerificationReportInspectItemDto();
          dto.qualifiedVerifyReportMaterials = result.performanceVerificationMaterials.map((b) => {
            let materialDto = new CreatePerformanceVerificationReportMaterialDto();
            materialDto.init(b);
            return materialDto;
          });       
          Object.assign(dto, a);         
          dto.performanceVerificationReportTestResults = [];
          dto.inspectionItemId = a.id;

          dto.performanceVerificationReportTestResults = [];
          for (let i = 0; i < 5; i++) {


            this.addTestResultsModel(dto);
          }
          return dto;
        });
        console.log(this.input);
      });
   
  }
  getDictionary():void{
    this.instrumentServiceProxy.getInstrumentList().subscribe((result: GetInstrumentListOutput[]) => {
      this.instruments = result.map((d) => {
        return { name: d.name, value: d.id };
      });
    });

    this.dataDictionaryServiceProxy.getDataDictionaryValues([
      this.enumObject.DictType.InspectResultType
    ]).subscribe((result: DataDictionaryDto[]) => {
      result.forEach((d) => {
        this.dicts = d.dataDictionaryDetails.map((d) => {
          d.value = d.id;
          return d;
        });

      });
    });
  }


  getDetail():void{
    this.performanceVerificationReportServiceProxy.getPerformanceVerificationReportForEdit(this.id).subscribe((result:GetPerformanceVerificationReportForEditOutput)=>{
      this.input.init(result);
      this.input.qualifiedVerifyReportInspectItems=result.qualifiedVerifyReportInspectItems.map(d=>{
        let dto = new CreatePerformanceVerificationReportInspectItemDto();
        dto.init(d);
        Object.assign(dto,d.inspectionItem);
        return dto;
      })
    })
  }
  calculateResult(item: CreatePerformanceVerificationReportTestResultDto, insp: any): void {
    if(!item.oldBatchNoInspectValue || !item.newBatchNoInspectValue){
     
      return;
    }
    if (!this.input.verificationStandardValue) {
      this.nzMessage.error('请填写判定标准');
     
    }
    item.deviationValue = this.getResultByCalculationType(insp.calculationType, item);
    item.deviationValue = Number(item.deviationValue.toFixed(2));
    if (insp.performanceVerificationType === this.enumObject.PerformanceVerificationType.NegativePositive) {
      if (item.deviationValue <= insp.deviation && item.oldBatchNoInspectResult === item.newBatchNoInspectResult) {
        item.inspectResultType = this.enumObject.InspectResultType.Pass;
      } else {
        item.inspectResultType = this.enumObject.InspectResultType.Unpass;
      }
    } else {
      if (item.deviationValue <= insp.deviation) {
        item.inspectResultType = this.enumObject.InspectResultType.Pass;
      } else {
        item.inspectResultType = this.enumObject.InspectResultType.Unpass;
      }
    }

    this.calculateQualifiedVerifyResultType(insp);
  };
  calculateQualifiedVerifyResultType(insp): void {
    var flag = 0;
    insp.performanceVerificationReportTestResults.forEach(a => {
      if (a.inspectResultType === this.enumObject.InspectResultType.Pass) {
        flag++;
      }
    });
    if (flag / insp.performanceVerificationReportTestResults.length * 100 >= this.input.verificationStandardValue) {
      insp.qualifiedVerifyResultType = this.enumObject.QualifiedVerifyResultType.Pass;
    } else {
      insp.qualifiedVerifyResultType = this.enumObject.QualifiedVerifyResultType.Unpass;
    }
  };
  getResultByCalculationType(type, item) {
    switch (type) {
      case this.enumObject.CalculationType.TypeB:
        return Math.abs(item.oldBatchNoInspectValue - item.newBatchNoInspectValue);
      default:
        return Math.abs(item.oldBatchNoInspectValue - item.newBatchNoInspectValue) * 100 / item.oldBatchNoInspectValue;


    }
  };
  addTestResultsModel(insp: CreatePerformanceVerificationReportInspectItemDto): void {
    insp.performanceVerificationReportTestResults = [...insp.performanceVerificationReportTestResults, new CreatePerformanceVerificationReportTestResultDto()];
  };
  deleteResultItem(insp: CreatePerformanceVerificationReportInspectItemDto,result:CreatePerformanceVerificationReportTestResultDto):void{
    insp.performanceVerificationReportTestResults=insp.performanceVerificationReportTestResults.filter(d=>d!==result);
  }
  complete(): void {
    this.performanceVerificationReportServiceProxy.createOrUpdatePerformanceVerificationReport(this.input)
      .pipe(finalize(() => {
      }))
      .subscribe(() => {
        this.nzMessage.success('保存成功');
      });
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.id = params['id'];
      if(params['type']==='list'){
          this.getDetail();
      }else{
        this.list();
      }
      this.getDictionary();
      
    });
    this.input.qualifiedVerifyReportInspectItems = [];
    this.user=this.appSession.user.name;
  }

  delete(): void {

  }

  back(): void {
    //this.router.navigateByUrl('/app/verificat/waiting')
    this.location.back();
  }






}

