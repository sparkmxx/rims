export class AppConsts {

    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'rims'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };
    static readonly enumArray = {
		ApprovalGradeType:[
			{"key":"One","value":1,"description":"一级","SortRank":"0"},
			{"key":"Two","value":2,"description":"二级","SortRank":"0"},
			{"key":"Three","value":3,"description":"三级","SortRank":"0"}
		], 
		ApprovalNotificationType:[
			{"key":"Request","value":2,"description":"请领1","SortRank":"0"},
			{"key":"Purchase","value":1,"description":"请购","SortRank":"0"}
		], 
		ApprovalResultState:[
			{"key":"Pending","value":0,"description":"待审核","SortRank":"0"},
			{"key":"Agreement","value":1,"description":"同意","SortRank":"0"},
			{"key":"Dismissed","value":2,"description":"已驳回","SortRank":"0"}
		], 
		CalculationType:[
			{"key":"TypeA","value":1,"description":"TypeA","SortRank":"0"},
			{"key":"TypeB","value":2,"description":"TypeB","SortRank":"0"},
			{"key":"TypeC","value":3,"description":"TypeC","SortRank":"0"}
		], 
		QualifiedVerifyType:[
			{"key":"Default","value":0,"description":"Default","SortRank":"0"}
		], 
		QualifiedVerifyResultType:[
			{"key":"Unpass","value":0,"description":"不合格","SortRank":"0"},
			{"key":"Pass","value":1,"description":"合格","SortRank":"0"}
		], 
		InspectResultType:[
			{"key":"Unpass","value":0,"description":"不通过","SortRank":"0"},
			{"key":"Pass","value":1,"description":"通过","SortRank":"0"}
		], 
		DictType:[
			{"key":"None","value":0,"description":"空字典","SortRank":"0"},
			{"key":"StorageCondition","value":1,"description":"存储条件","SortRank":"0"},
			{"key":"StorageConditionFreezing","value":2,"description":"存储条件冷冻","SortRank":"0"},
			{"key":"StorageConditionRefrigeration","value":3,"description":"存储条件冷藏","SortRank":"0"},
			{"key":"StorageConditionCool","value":4,"description":"存储条件阴凉","SortRank":"0"},
			{"key":"StorageConditionNormalTemperature","value":5,"description":"存储条件常温","SortRank":"0"},
			{"key":"StorageConditionOther","value":6,"description":"存储条件其他","SortRank":"0"},
			{"key":"MaterialType","value":9,"description":"物料类型","SortRank":"0"},
			{"key":"MaterialUnit","value":10,"description":"物料单位","SortRank":"0"},
			{"key":"DisabledReason","value":11,"description":"停用原因","SortRank":"0"},
			{"key":"InspectResultType","value":12,"description":"样本阴阳性结果","SortRank":"0"},
			{"key":"MethodologyType","value":13,"description":"方法学","SortRank":"0"},
			{"key":"PerformanceVerificationNegativePositive","value":14,"description":"性能验证阴阳性","SortRank":"0"}
		], 
		InventoryApprovalState:[
			{"key":"Pending","value":1,"description":"待审核","SortRank":"0"},
			{"key":"Going","value":2,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":3,"description":"已完成","SortRank":"0"},
			{"key":"Dismissed","value":4,"description":"已驳回","SortRank":"0"},
			{"key":"Closed","value":5,"description":"已结案","SortRank":"0"},
			{"key":"Abolished","value":6,"description":"已作废","SortRank":"0"}
		], 
		InventoryState:[
			{"key":"Going","value":1,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":2,"description":"已完成","SortRank":"0"}
		], 
		MaterialPurchaseState:[
			{"key":"Pending","value":1,"description":"待审核","SortRank":"0"},
			{"key":"Going","value":2,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":3,"description":"已完成","SortRank":"0"},
			{"key":"Dismissed","value":4,"description":"已驳回","SortRank":"0"},
			{"key":"Closed","value":5,"description":"已结案","SortRank":"0"},
			{"key":"Abolished","value":6,"description":"已作废","SortRank":"0"}
		], 
		OutInStorageType:[
			{"key":"None","value":0,"description":"无","SortRank":"0"},
			{"key":"Out","value":1,"description":"出库","SortRank":"0"},
			{"key":"In","value":2,"description":"入库","SortRank":"0"}
		], 
		BarcodeOperationType:[
			{"key":"Out","value":1,"description":"出库","SortRank":"0"},
			{"key":"In","value":2,"description":"入库","SortRank":"0"},
			{"key":"Inventory","value":3,"description":"盘点","SortRank":"0"}
		], 
		OutStorageApprovalState:[
			{"key":"Pending","value":1,"description":"待审核","SortRank":"0"},
			{"key":"Going","value":2,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":3,"description":"已完成","SortRank":"0"},
			{"key":"Dismissed","value":4,"description":"已驳回","SortRank":"0"},
			{"key":"Closed","value":5,"description":"已结案","SortRank":"0"},
			{"key":"Abolished","value":6,"description":"已作废","SortRank":"0"}
		], 
		OutStorageState:[
			{"key":"Going","value":1,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":2,"description":"已完成","SortRank":"0"}
		], 
		OutStorageType:[
			{"key":"Request","value":1,"description":"请领","SortRank":"0"},
			{"key":"Use","value":2,"description":"领用","SortRank":"0"},
			{"key":"Inventory","value":3,"description":"盘点","SortRank":"0"},
			{"key":"Other","value":4,"description":"其他","SortRank":"0"}
		], 
		PerformanceVerificationType:[
			{"key":"Quantitative","value":1,"description":"定量","SortRank":"0"},
			{"key":"NegativePositive","value":2,"description":"定性","SortRank":"0"}
		], 
		NegativePositiveType:[
			{"key":"Negative","value":1,"description":"阴性","SortRank":"0"},
			{"key":"Positive","value":2,"description":"阳性","SortRank":"0"}
		], 
		PurchaseApprovalState:[
			{"key":"Going","value":1,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":2,"description":"已完成","SortRank":"0"}
		], 
		RequestApprovalState:[
			{"key":"Going","value":1,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":2,"description":"已完成","SortRank":"0"}
		], 
		RequestPurchaseState:[
			{"key":"Pending","value":1,"description":"待审核","SortRank":"0"},
			{"key":"Going","value":2,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":3,"description":"已完成","SortRank":"0"},
			{"key":"Dismissed","value":4,"description":"已驳回","SortRank":"0"},
			{"key":"Closed","value":5,"description":"已结案","SortRank":"0"},
			{"key":"Abolished","value":6,"description":"已作废","SortRank":"0"}
		], 
		ScanType:[
			{"key":"PurchaseStorage","value":1,"description":"请购入库","SortRank":"0"},
			{"key":"OutStorage","value":2,"description":"出库","SortRank":"0"},
			{"key":"OtherStorage","value":3,"description":"其他入库","SortRank":"0"},
			{"key":"Inventory","value":4,"description":"盘点","SortRank":"0"}
		], 
		StorageApprovalState:[
			{"key":"Pending","value":1,"description":"待审核","SortRank":"0"},
			{"key":"Going","value":2,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":3,"description":"已完成","SortRank":"0"},
			{"key":"Dismissed","value":4,"description":"已驳回","SortRank":"0"},
			{"key":"Closed","value":5,"description":"已结案","SortRank":"0"},
			{"key":"Abolished","value":6,"description":"已作废","SortRank":"0"}
		], 
		StorageState:[
			{"key":"Going","value":1,"description":"进行中","SortRank":"0"},
			{"key":"Finished","value":2,"description":"已完成","SortRank":"0"}
		], 
		StorageType:[
			{"key":"Purchase","value":1,"description":"请购入库","SortRank":"0"},
			{"key":"Material","value":2,"description":"物料入库","SortRank":"0"},
			{"key":"Other","value":3,"description":"其他入库","SortRank":"0"},
			{"key":"Inventory","value":4,"description":"盘点入库","SortRank":"0"},
			{"key":"Request","value":5,"description":"请领入库","SortRank":"0"}
		], 
		VendorType:[
			{"key":"Manufacturer","value":1,"description":"制造商","SortRank":"0"},
			{"key":"Supplier","value":2,"description":"供应商","SortRank":"0"},
			{"key":"DeliveryCompany","value":3,"description":"送货公司","SortRank":"0"},
			{"key":"InvoicingCompany","value":4,"description":"开票公司","SortRank":"0"}
		], 
		WarehouseGradeType:[
			{"key":"One","value":1,"description":"一级","SortRank":"0"},
			{"key":"Two","value":2,"description":"二级","SortRank":"0"},
			{"key":"Three","value":3,"description":"三级","SortRank":"0"}
		], 
		WorkflowType:[
			{"key":"Purchase","value":1,"description":"请购","SortRank":"0"},
			{"key":"Storage","value":2,"description":"入库","SortRank":"0"},
			{"key":"Request","value":3,"description":"请领","SortRank":"0"},
			{"key":"Inventory","value":4,"description":"盘点","SortRank":"0"}
		]
	};
    static readonly enumObject: any ={
		ApprovalGradeType : {
			"One":1,
			"Two":2,
			"Three":3
			},
		ApprovalNotificationType : {
			"Purchase":1,
			"Request":2
			},
		ApprovalResultState : {
			"Pending":0,
			"Agreement":1,
			"Dismissed":2
			},
		CalculationType : {
			"TypeA":1,
			"TypeB":2
			},
		QualifiedVerifyType : {
			"Default":0
			},
		QualifiedVerifyResultType : {
			"Pass":1,
			"Unpass":0
			},
		InspectResultType : {
			"Pass":1,
			"Unpass":0
			},
		DictType : {
			"None":0,
			"StorageCondition":1,
			"StorageConditionFreezing":2,
			"StorageConditionRefrigeration":3,
			"StorageConditionCool":4,
			"StorageConditionNormalTemperature":5,
			"StorageConditionOther":6,
			"MaterialType":9,
			"MaterialUnit":10,
			"DisabledReason":11,
			"InspectResultType":12,
			"MethodologyType":13
			},
		InventoryApprovalState : {
			"Pending":1,
			"Going":2,
			"Finished":3,
			"Dismissed":4,
			"Closed":5,
			"Abolished":6
			},
		InventoryState : {
			"Going":1,
			"Finished":2
			},
		MaterialPurchaseState : {
			"Pending":1,
			"Going":2,
			"Finished":3,
			"Dismissed":4,
			"Closed":5,
			"Abolished":6
			},
		OutInStorageType : {
			"Out":1,
			"In":2
			},
		OutStorageApprovalState : {
			"Pending":1,
			"Going":2,
			"Finished":3,
			"Dismissed":4,
			"Closed":5,
			"Abolished":6
			},
		OutStorageState : {
			"Going":1,
			"Finished":2
			},
		OutStorageType : {
			"Request":1,
			"Use":2,
			"Inventory":3,
			"Other":4
			},
		PerformanceVerificationType : {
			"Quantitative":1,
			"NegativePositive":2
			},
		NegativePositiveType : {
			"Negative":1,
			"Positive":2
			},
		PurchaseApprovalState : {
			"Going":1,
			"Finished":2
			},
		RequestApprovalState : {
			"Going":1,
			"Finished":2
			},
		RequestPurchaseState : {
			"Pending":1,
			"Going":2,
			"Finished":3,
			"Dismissed":4,
			"Closed":5,
			"Abolished":6
			},
		ScanType : {
			"PurchaseStorage":1,
			"OutStorage":2,
			"OtherStorage":3
			},
		StorageApprovalState : {
			"Pending":1,
			"Going":2,
			"Finished":3,
			"Dismissed":4,
			"Closed":5,
			"Abolished":6
			},
		StorageState : {
			"Going":1,
			"Finished":2
			},
		StorageType : {
			"Purchase":1,
			"Material":2,
			"Other":3,
			"Inventory":4
			},
		VendorType : {
			"Manufacturer":1,
			"Supplier":2,
			"DeliveryCompany":3,
			"InvoicingCompany":4
			},
		WarehouseGradeType : {
			"One":1,
			"Two":2,
			"Three":3
			},
		WorkflowType : {
			"Purchase":1,
			"Storage":2,
			"Request":3,
			"Inventory":4
			}
	};
}
