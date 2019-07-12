import { Component, OnInit, Injector,Input, ViewChild} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NzTreeNode,NzTreeComponent } from 'ng-zorro-antd';
import {
  DataDictionaryDto, BrandServiceProxy, GetBrandListOutput, OrganizationUnitDto, OrganizationUnitServiceProxy, DataDictionaryServiceProxy, ListResultDtoOfOrganizationUnitDto, InstrumentServiceProxy,GetInstrumentListOutput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import {QueryConditionDTO} from '@shared/customDTO';


@Component({
  selector: 'app-query-condition',
  templateUrl: './query-condition.component.html',
  styleUrls: ['./query-condition.component.less']
})
export class QueryConditionComponent extends AppComponentBase implements OnInit {

  @Input() queryDTO:QueryConditionDTO;
  @Input() conditionWithTime:boolean;
  filter = '';
  loading = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  organizationUnits: OrganizationUnitDto[] = [];
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  dicts= {};
  brands:any[] = [];
  applys:any[] = [];
  instrumnets:any[]=[];
  @ViewChild('nzTreeComponent') nzTreeComponent:NzTreeComponent;
  //queryDTO:QueryConditionDTO=new QueryConditionDTO();
  constructor(private injector: Injector,
    private messageService: NzMessageService,
    private organizationUnitServiceProxy: OrganizationUnitServiceProxy,
    private dataDictionaryServiceProxy: DataDictionaryServiceProxy,
    private brandServiceProxy: BrandServiceProxy,
    private instrumentServiceProxy: InstrumentServiceProxy
  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.getList();
    this.getDictionary();
  }


  onChange(e:any):void{
    const org=this.nzTreeComponent.getSelectedNodeList().find(d=>d.key==e);
    this.queryDTO.organizationName=org?org.title:'';
  }

  rsult():void{
    console.log(this.queryDTO);
  }

  getList(): void {
    this.organizationUnitServiceProxy.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
      this.organizationUnits = result.items;
      this.treeNodes = this.convertToTreeNode(this.organizationUnits);
    });
    this.brandServiceProxy.getBrandList().subscribe((result: GetBrandListOutput[]) => {
      this.brands = result.map((d) => {
        return { name: d.name, value: d.id };
      });

    })
    this.instrumentServiceProxy.getInstrumentList().subscribe((result: GetInstrumentListOutput[]) => {
      this.instrumnets = result.map((d) => {
        return { name: d.name, value: d.id };
      });

    })
  }

  getDictionary(): void {
    this.dataDictionaryServiceProxy.getDataDictionaryValues([
      this.enumObject.DictType.MaterialType
    ]).subscribe((result: DataDictionaryDto[]) => {
      result.forEach((d) => {
        this.dicts[d.dictType] = d.dataDictionaryDetails.map((d) => {
          d.value = d.id;
          return d;
        });
      });
    });
  }








}
