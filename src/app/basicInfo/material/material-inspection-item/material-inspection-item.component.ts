
import { Component, Injector, OnInit, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import {
  InspectionItemServiceProxy, PagedResultDtoOfGetInspectionItemPaginationOutput, GetInspectionItemPaginationOutput,
  PerformanceVerificationMaterialDto, DataDictionaryServiceProxy, DataDictionaryDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-material-inspection-item',
  templateUrl: './material-inspection-item.component.html',
  styleUrls: ['./material-inspection-item.component.less']
})
export class MaterialInspectionItemComponent extends PagedListingComponentBase<GetInspectionItemPaginationOutput> implements OnInit {

  data: GetInspectionItemPaginationOutput[] = [];
  loading = false;
  sortName = null;
  sortValue = null;
  filter = '';
  visible = false;
  isAllDisplayDataChecked = false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  dicts = [];
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(private inspectionItemServiceProxy: InspectionItemServiceProxy,
    private modelService: NzModalService,
    private injector: Injector,
    private dataDictionaryServiceProxy: DataDictionaryServiceProxy,
    private messageService: NzMessageService) {
    super(injector);
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.inspectionItemServiceProxy.getInspectionItems(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.filter, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfGetInspectionItemPaginationOutput) => {
        this.data = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  ngOnInit(): void {

  }
  refreshStatus(dto: GetInspectionItemPaginationOutput): void {
    this.isAllDisplayDataChecked = this.data.every(item => this.mapOfCheckedId[item.id]);
    if (this.mapOfCheckedId[dto.id]) {
      if (this.checkeds.indexOf(dto) < 0) {
        this.checkeds.push(dto);
      }
    } else {
      this.checkeds = this.checkeds.filter(d => d != dto);
    }

  }

  checkAll(value: boolean): void {
    this.data.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  delete(): void {

  }
  save(): void {
    this.modalSave.emit(this.checkeds);
    this.close();
  }
  getDictionary(): void {
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
  show(performanceVerificationMaterials: PerformanceVerificationMaterialDto[]): void {
    this.mapOfCheckedId = {};
    this.refresh();
    this.getDictionary();
    performanceVerificationMaterials.forEach((d) => {
      this.mapOfCheckedId[d.inspectionItemId] = true;
    })
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }
  sort(sort: { key: string, value: string }): void {
    if (sort.key && sort.value) {
      this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
    }
  }

}
