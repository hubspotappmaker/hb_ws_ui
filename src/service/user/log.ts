import dataxios from "@/lib/axios.wrapper/axios.data";
import { ShopifyModuleKey } from "@/lib/constant/shopify.constant";

export const getAllLog = async (
    page: number,
    limit: number,
    module?: ShopifyModuleKey,
    status?: boolean
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    if (module)
    {
        params.append("module", module);
    }
    if (status !== undefined)
    {
        params.append("status", status.toString());
    }

    const url = `log/get-all?${params.toString()}`;
    const response = await dataxios.get(url);

    return response;
};
