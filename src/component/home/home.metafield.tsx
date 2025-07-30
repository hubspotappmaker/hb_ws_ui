import { ShopifyModules } from '@/lib/constant/shopify.constant';
interface Iprop {
    module: typeof ShopifyModules
}
const Metafield = (prop: Iprop) => {
    return (
        <>
            mapping metafield for {prop.module}
        </>
    )
}

export default Metafield;