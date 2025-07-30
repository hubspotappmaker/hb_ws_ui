export interface CreateTierDto {
    name: string;
    connectLimit: number;
    appLimit: number;
}

export type UpdateTierDto = Partial<CreateTierDto>;
