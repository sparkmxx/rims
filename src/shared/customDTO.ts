

export interface IQueryConditionDTO {
    organizationId: number,
    organizationName: string,
    brandId: string,
    instrumentId: string,
    materialTypeId: string,
    filter:string,
    startDate:Date,
    endDate:Date
}


export class QueryConditionDTO implements IQueryConditionDTO {
    organizationId: number | undefined;
    organizationName: string | undefined;
    brandId: string | undefined;
    instrumentId: string | undefined;
    materialTypeId: string | undefined;
    filter: string | undefined;
    startDate:Date | undefined;
    endDate:Date | undefined;
    constructor(data?: IQueryConditionDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

}

export interface IStorageBatchWriteDTO {
    deliveryOrderNo: string,
    invoiceNo: string,
    temperature: string,
    isPackageComplete: boolean,
    isMaterialWithTicket:boolean,
    
}


export class StorageBatchWriteDTO implements IStorageBatchWriteDTO {
    deliveryOrderNo: string | undefined;
    invoiceNo: string | undefined;
    temperature: string | undefined;
    isPackageComplete: boolean | undefined;
    isMaterialWithTicket:boolean | undefined;
    constructor(data?: IStorageBatchWriteDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

}