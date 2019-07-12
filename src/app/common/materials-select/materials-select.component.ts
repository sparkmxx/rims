import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
  MaterialServiceProxy,PagedResultDtoOfGetMaterialPaginationOutput,GetMaterialPaginationOutput
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-materials-select',
  templateUrl: './materials-select.component.html',
  styleUrls: ['./materials-select.component.less']
})
export class MaterialsSelectComponent extends PagedListingComponentBase<GetMaterialPaginationOutput> implements OnInit{

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    data: GetMaterialPaginationOutput[]=[];
    sortName = null;
    sortValue = null;
    loading = false;
    filter = '';
    visible=false;
    isAllDisplayDataChecked = false;
    isIndeterminate = false;
    mapOfCheckedId: { [key: string]: boolean } = {};
    checkeds:any[]=[];
    
    constructor(injector: Injector,
        private materialServiceProxy: MaterialServiceProxy) {
        super(injector);
       
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {

        this.materialServiceProxy.getMaterials(undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,this.filter,'',undefined,'', request.maxResultCount, request.skipCount).pipe(
            finalize(() => {
                finishedCallback()
            })
        ).subscribe((result: PagedResultDtoOfGetMaterialPaginationOutput) => {
            this.data = result.items;
            this.showPaging(result, pageNumber);
        });
    }

    ngOnInit():void{

    }
    
      refreshStatus(item:GetMaterialPaginationOutput): void {
        this.isAllDisplayDataChecked = this.data.every(item => this.mapOfCheckedId[item.id]);
        console.log(this.mapOfCheckedId);
        if(this.mapOfCheckedId[item.id]){
            if(this.checkeds.indexOf(item.id)<0){
                this.checkeds.push(item);
            }
        }else{
            this.checkeds=this.checkeds.filter(d=>d!=item);
        }
        
      }
    
      checkAll(value: boolean): void {
        this.data.forEach((item) => {
            this.mapOfCheckedId[item.id] = value;
            if(value){
                if(this.checkeds.indexOf(item.id)<0){
                    this.checkeds.push(item);
                }
            }else{
                this.checkeds=this.checkeds.filter(d=>d!=item);
            }
        });
      }

    keypress(event: any): void {
        if (event.keyCode == 13) {
            this.refresh();
        }
    }


    delete():void{
      
    }
    saveUsers():void{
        console.log(this.checkeds);
        
        this.modalSave.emit(this.checkeds);
        this.visible=false;
    }
    close():void{
        this.visible=false;
    }
    show():void{
      this.refresh();
      this.visible=true;
    }

    sort(sort: { key: string, value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        if (this.sortName && this.sortValue) {
            this.data = this.data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
        } else {
            this.data = this.data;
        }
    }


}
