import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {
    ApprovalWorkflowServiceProxy,CreateOrUpdateApprovalWorkflowInput,GetApprovalWorkflowForEditOutput,CreateOrUpdateApprovalWorkflowDetailInput,OrganizationUnitServiceProxy,ListResultDtoOfOrganizationUnitDto,
    OrganizationUnitDto,RoleServiceProxy,ListResultDtoOfRoleListDto,RoleListDto
} from '@shared/service-proxies/service-proxies';
import {NzMessageService} from 'ng-zorro-antd';
import {AppComponentBase} from '@shared/app-component-base';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NzTreeNode } from 'ng-zorro-antd';
import { FormatOrganizationUnitIdPipe } from '@shared/pipes/formatOrganizationUnitId';
@Component({
  selector: 'app-approval-workflow-edit',
  templateUrl: './approval-workflow-edit.component.html',
  styleUrls: ['./approval-workflow-edit.component.less']
})
export class ApprovalWorkflowEditComponent extends AppComponentBase implements OnInit {
    createOrUpdateApprovalWorkflowInput: CreateOrUpdateApprovalWorkflowInput = new CreateOrUpdateApprovalWorkflowInput();
    isVisible = false;
    isConfirmLoading = false;
    data = [];
    validateForm: FormGroup;
    organizationUnits:OrganizationUnitDto[]=[];
    treeNodes: NzTreeNode[] = [];
    roles:RoleListDto[]=[];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();


    constructor(private approvalWorkflowServiceProxy: ApprovalWorkflowServiceProxy,
                private organizationUnitServiceProxy:OrganizationUnitServiceProxy,
                private formatOrganizationUnitIdPipe:FormatOrganizationUnitIdPipe,
                private roleServiceProxy:RoleServiceProxy,
                private injector: Injector,
                private messageService: NzMessageService,
                private fb: FormBuilder) {
        super(injector);
    }



    getList(): void {
        this.organizationUnitServiceProxy.getOrganizationUnitsWithChildren().pipe().subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
        this.organizationUnits = result.items;
        this.treeNodes = this.convertToTreeNode(this.organizationUnits);
      });

      this.roleServiceProxy.getRoleList().pipe().subscribe((result: ListResultDtoOfRoleListDto) => {
        this.roles = result.items;
      });
    }



    deleteDataDictionaryDetails(data: CreateOrUpdateApprovalWorkflowDetailInput): void {
        this.createOrUpdateApprovalWorkflowInput.approvalWorkflowDetails=this.createOrUpdateApprovalWorkflowInput.approvalWorkflowDetails.filter(d=>d!=data);
    }







    addApprovalWorkflowDetails(): void {
        this.createOrUpdateApprovalWorkflowInput.approvalWorkflowDetails=[...this.createOrUpdateApprovalWorkflowInput.approvalWorkflowDetails,new CreateOrUpdateApprovalWorkflowDetailInput()]
    }


    ngOnInit() {
        this.validateForm = this.fb.group({
            workflowType: [null, [Validators.required]],
            name: [null, [Validators.required]],
            organizationId: [null, [Validators.required]]
        });
    }

   

    show(id?:any): void {
        this.createOrUpdateApprovalWorkflowInput=new CreateOrUpdateApprovalWorkflowInput();
        this.createOrUpdateApprovalWorkflowInput.approvalWorkflowDetails=[];
        if(id){
            this.approvalWorkflowServiceProxy.getApprovalWorkflowForEdit(id)
            .pipe(finalize(() => {
                this.isConfirmLoading = false;
            }))
            .subscribe((result:GetApprovalWorkflowForEditOutput) => {
                this.createOrUpdateApprovalWorkflowInput.init(result);
                
            });
        }
        
        this.getList();
        this.isVisible = true;
    }

    save(): void {
        this.addService();
    }

    addService(): void {
        this.isConfirmLoading = true;
        this.createOrUpdateApprovalWorkflowInput.organizationName=this.formatOrganizationUnitIdPipe.transform(this.createOrUpdateApprovalWorkflowInput.organizationId,this.organizationUnits)
        this.approvalWorkflowServiceProxy.createOrUpdateApprovalWorkflow(this.createOrUpdateApprovalWorkflowInput)
            .pipe(finalize(() => {
                this.isConfirmLoading = false;
            }))
            .subscribe(() => {
                this.modalSave.emit(null);
                this.handleCancel();
                this.messageService.create('success', `添加成功`);
            });
    }

    handleCancel(): void {
        this.isVisible = false;
    }

}

