export interface CreateTierDto {
    name: string;
    connectLimit: number;
    appLimit: number;
    sku: string;
}

export type UpdateTierDto = Partial<CreateTierDto>;
