export interface CreateTierDto {
    name: string;
    connectLimit: number;
    appLimit: number;
    orderSyncLimit: number;
    productSyncLimit: number;
    customerSyncLimit: number;
    metafieldLimit: number;
}

export type UpdateTierDto = Partial<CreateTierDto>;
