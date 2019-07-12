


import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import {
    ModuleServiceProxy,
    CreateOrUpdateModuleInput,
    GetModuleForEditOutput,
    GetModuleListOutput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';

@Component({
  selector: 'app-module-edit',
  templateUrl: './module-edit.component.html',
  styleUrls: ['./module-edit.component.less']
})

export class ModuleEditComponent extends AppComponentBase implements OnInit {

    @ViewChild('modalContent') modalContent: ElementRef;

    moduleDto: CreateOrUpdateModuleInput=new CreateOrUpdateModuleInput();
    isVisible: boolean = false;
    saving: boolean = false;
    validateForm: FormGroup;
    treeNodes:NzTreeNode[]=[];
    modules:GetModuleListOutput[]=[];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    expandKeys = [];
    value: string;

    constructor(private moduleService: ModuleServiceProxy,
        private injector: Injector,
        private fb: FormBuilder) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            displayName: [null, [Validators.required]],
            name: [null, [Validators.required]]
        });
        
    }



    show(id: any): void {
        this. getList();
        this.moduleDto = new CreateOrUpdateModuleInput();
        this.moduleService.getModuleForEdit(id).pipe().subscribe((result: GetModuleForEditOutput) => {
            this.moduleDto.init(result);
        });
        this.isVisible = true;
    }
    add(id:string){
        this. getList();
        this.moduleDto = new CreateOrUpdateModuleInput();
        if(id){
            this.moduleDto.parentId=id;
        }
        this.isVisible = true;
    }
    getList():void{
        this.moduleService.getModuleList().pipe().subscribe((result:GetModuleListOutput[])=>{
               this.modules=result;
               this.treeNodes=this.convertToTreeNode(this.modules);
        });
    }

  

    save(): void {
        this.create();
    }

    create(): void {
        this.saving = true;
        this.moduleService.createOrUpdateModule(this.moduleDto)
            .pipe(finalize(() => {
                this.saving = false;
            }))
            .subscribe(() => {
                this.modalSave.emit(null);
                this.close();
                this.nzMessage.success('新增成功');
            });
    }

  

    
    onChange($event: string): void {
        console.log($event);
      }
    
    close(): void {
        this.isVisible = false;
    }

}

