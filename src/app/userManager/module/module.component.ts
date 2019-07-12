
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModuleServiceProxy, GetModulePaginationOutput, PagedResultDtoOfGetModulePaginationOutput } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { ModuleEditComponent } from './module-edit/module-edit.component';
import { finalize } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
export interface TreeNodeInterface {
  id: string;
  name: string;
  displayName: string;
  level: number;
  expand: boolean;
  selected: false;
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.less']
})



export class ModuleComponent extends PagedListingComponentBase<GetModulePaginationOutput> {

  @ViewChild('moduleEditModal') moduleEditModal: ModuleEditComponent;
  data: GetModulePaginationOutput[] = [];
  expandDataCache = {};
  filter: string = "";
  selectedId: string;
  constructor(private injector: Injector, private moduleService: ModuleServiceProxy, private nzModalService: NzModalService) {
    super(injector);
  }




  public list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {

    this.moduleService.getModules(this.filter, '', request.maxResultCount, request.skipCount).pipe(finalize(() => {
      finishedCallback();
    }))
      .subscribe((result: PagedResultDtoOfGetModulePaginationOutput) => {
        this.data = result.items;
        this.data.forEach(item => {
          this.expandDataCache[item.id] = this.convertTreeToList(item);
        });
        if (this.selectedId&&this.expandDataCache[this.selectedId]) {
          const d = this.expandDataCache[this.selectedId].find(d => d.id === this.selectedId);
          d.expand = true;
        }
        console.log(this.expandDataCache);
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(module: GetModulePaginationOutput): void {
    this.nzModalService.confirm({
      nzTitle: '是否删除该记录?',
      nzContent: '删除不可恢复，请谨慎操作',
      nzOnOk: () => {
        this.moduleService.deleteModule(module.id)
          .subscribe(() => {
            this.nzMessage.success('删除成功');
            this.refresh();
          });
      }
    });

  }

  keypress(event: any): void {
    if (event.keyCode == 13) {
      this.refresh();
    }
  }
  selectModule(id:string): void {
    this.selectedId = id;
  }
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }


  createModule(): void {
    this.moduleEditModal.add(this.selectedId);
  }

  editModule(module: GetModulePaginationOutput): void {
    this.moduleEditModal.show(module.id);
  }


} 
