export const ShopifyModules = {
    PRODUCT: 'Product',
    CUSTOMER: 'Customer',
    ORDER: 'Order',
} as const;

export type ShopifyModuleKey = keyof typeof ShopifyModules;