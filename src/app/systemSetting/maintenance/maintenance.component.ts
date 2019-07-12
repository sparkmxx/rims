import {Component, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzMessageService, NzModalService, NzModalRef} from 'ng-zorro-antd';
import {PagedListingComponentBase, PagedRequestDto} from 'shared/paged-listing-component-base';
import {QueryConditionDTO} from '@shared/customDTO';

import {
   CachingServiceProxy,ListResultDtoOfCacheDto ,CacheDto,EntityDtoOfString
} from '@shared/service-proxies/service-proxies';
import {finalize} from 'rxjs/operators';
import {MaterialBarcodesComponent} from '@app/common/material-barcodes/material-barcodes.component';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.less']
})
export class MaintenanceComponent extends AppComponentBase implements OnInit {
    @ViewChild('barcodeInfos') barcodeInfos:MaterialBarcodesComponent;
    data: CacheDto[] = [];
    loading = false;
    sortName = null;
    sortValue = null;
    filter = '';
    constructor(private cachingServiceProxy: CachingServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService
                ) {
        super(injector);
    }

    list(): void {
      this.loading=true;
      this.cachingServiceProxy.getAllCaches()
      .pipe(finalize(() => {
        this.loading=false;
      }))
      .subscribe((result: ListResultDtoOfCacheDto) => {
          this.data = result.items;
      });
    }
    clearCache(cache:CacheDto):void{
      this.loading=true;
      const input=new EntityDtoOfString();
      input.id=cache.name;
      this.cachingServiceProxy.clearCache(input).pipe(finalize(()=>{
        this.loading=false;
      })).subscribe(()=>{
        this.nzMessage.success('清除成功');
      });
    }
    clearAll():void{
      this.loading=true;
      this.cachingServiceProxy.clearAllCaches().pipe(finalize(()=>{
        this.loading=false;
      })).subscribe(()=>{
        this.nzMessage.success('清除成功');
      });
    }
    ngOnInit():void{
      
      this.list();
    }
    delete(): void {
        
    }
    sort(sort: { key: string, value: string }): void {
        if (sort.key && sort.value) {
            this.data = this.data.sort((a, b) => (sort.value === 'ascend') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1));
        }
    }

}
