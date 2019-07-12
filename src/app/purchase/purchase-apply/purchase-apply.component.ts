
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Injector } from '@angular/core';
import { NzTableComponent, NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
import { NzTreeNode, UploadFile } from 'ng-zorro-antd';
import { QueryConditionDTO } from '@shared/customDTO';
import { AppConsts } from '@shared/AppConsts';
import {Router} from '@angular/router';
import {
  MaterialPurchaseServiceProxy, MaterialServiceProxy, GetMaterialPaginationOutput, PagedResultDtoOfGetMaterialPaginationOutput,
  CreateOrUpdateMaterialPurchaseInput, CreateOrUpdateMaterialPurchaseDetailDto, CreateOrUpdateMaterialPurchaseDto, OrganizationUnitDto, OrganizationUnitServiceProxy, DataDictionaryServiceProxy, BrandServiceProxy, PurchaseOrderImportOutput, PurchaseOrderImportMaterial,PurchaseOrderImportDto
} from '@shared/service-proxies/service-proxies';
@Component({
  selector: 'app-purchase-apply',
  templateUrl: './purchase-apply.component.html',
  styleUrls: ['./purchase-apply.component.less']
})
export class PurchaseApplyComponent extends PagedListingComponentBase<GetMaterialPaginationOutput> implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;
  private destroy$ = new Subject();
  listOfData: GetMaterialPaginationOutput[] = [];
  loading = false;
  isAllDisplayDataChecked = false;
  isVisible=false;
  checkeds = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  createOrUpdateMaterialPurchaseInput: CreateOrUpdateMaterialPurchaseInput;
  organizationUnits: OrganizationUnitDto[] = [];
  treeNodes: NzTreeNode[] = [];
  organizationId = '';
  applys = [];
  queryDTO: QueryConditionDTO = new QueryConditionDTO();
  remoteServiceBaseUrl = AppConsts.remoteServiceBaseUrl;
  errorInfos:PurchaseOrderImportDto[]=[];
  constructor(private injector: Injector,
    private materialServiceProxy: MaterialServiceProxy,
    private materialPurchaseServiceProxy: MaterialPurchaseServiceProxy,
    private messageService: NzMessageService,
    private router:Router
  ) {
    super(injector);
  }
  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }




  checkAll(value: boolean): void {
    this.listOfData.forEach(item => (this.mapOfCheckedId[item.id] = value));
  }

  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.materialServiceProxy.getMaterials(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.queryDTO.instrumentId, this.queryDTO.brandId, this.queryDTO.organizationId ? Number(this.queryDTO.organizationId) : undefined, this.queryDTO.materialTypeId, undefined, this.queryDTO.filter, '', request.maxResultCount, request.skipCount)
      .pipe(finalize(() => {
        finishedCallback()
      }))
      .subscribe((result: PagedResultDtoOfGetMaterialPaginationOutput) => {
        if (this.pageNumber === 1) {
          this.listOfData = result.items;
        } else {
          this.listOfData = [...this.listOfData, ...result.items];
        }
        this.showPaging(result, pageNumber);
        this.mapOfCheckedId = {};
      });
  }


  ngOnInit(): void {

    this.createOrUpdateMaterialPurchaseInput = new CreateOrUpdateMaterialPurchaseInput();
    this.createOrUpdateMaterialPurchaseInput.purchase = new CreateOrUpdateMaterialPurchaseDto();
    this.createOrUpdateMaterialPurchaseInput.purchase.materialPurchaseDetails = [];
    this.queryDTO.organizationId = this.appSession.user.organizationUnitId;
    this.refresh(true);
  }

  ngAfterViewInit(): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (this.pageNumber < this.totalPages && data < this.listOfData.length && data > this.listOfData.length - 8) {
          this.pageNumber++;
          this.getDataPage(this.pageNumber);
        }
      });
  }
  apply(): void {

    this.createOrUpdateMaterialPurchaseInput.purchase.applicantUserId = this.appSession.userId;
    this.createOrUpdateMaterialPurchaseInput.purchase.organizationId = this.appSession.user.organizationUnitId;
    this.createOrUpdateMaterialPurchaseInput.purchase.organizationName = this.appSession.user.organizationUnitName;
    let total = 0;
    this.createOrUpdateMaterialPurchaseInput.purchase.materialPurchaseDetails = this.applys.map((d) => {
      const detailDto = new CreateOrUpdateMaterialPurchaseDetailDto();
      detailDto.init(d);
      detailDto.materialId = d.id;
      detailDto.materialName = d.name;
      detailDto.id = undefined;
      total += detailDto.number * detailDto.price;
      return detailDto;
    });
    if(this.createOrUpdateMaterialPurchaseInput.purchase.materialPurchaseDetails.length===0){
      return;
    }
    this.createOrUpdateMaterialPurchaseInput.purchase.totalPrice = total;
    this.loading = true;
    this.materialPurchaseServiceProxy.createOrUpdateMaterialPurchase(this.createOrUpdateMaterialPurchaseInput)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe(() => {
        this.messageService.create('success', `请购成功`);
        this.router.navigateByUrl('/app/purchase/list'); 
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  delete(): void {

  }


  download(): void {
    window.location.href = "/assets/file/purchase.xlsx";
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

        this.materialPurchaseServiceProxy.handleImportFile(info.file.response.result.path).pipe().subscribe((result: PurchaseOrderImportOutput) => {
          
          if(result.errorInfos&&result.errorInfos.length>0){
            this.messageService.create('error','上传失败');
            this.errorInfos=result.errorInfos;            
            this.isVisible=true;
          }else{
            this.applys=[...this.applys,...result.materials];
          }
        });

        break;
      case 'error':
        this.messageService.create('error','上传失败');
        this.loading = false;
        break;
    }
  }
  handleCancel():void{
    this.isVisible=false;
  }
  deleteDetail(t: any) {
    this.applys = this.applys.filter(d => d != t);
  }
  clear(): void {
    this.applys = [];
  }
  confirmAdd(): void {
    for (let key in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[key]) {
        const t = this.applys.find(d => d.id === key);
        if (!t) {
          const record = this.listOfData.find(d => d.id === key);
          let d = {};
          d = Object.assign(d, record);
          this.applys = [...this.applys, d]
        }
      }
    }
  }
}
