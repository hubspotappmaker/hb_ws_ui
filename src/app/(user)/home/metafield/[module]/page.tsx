'use client'

import { MutedOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface PageProps {
    params: { module: string };
}

const Metafield = ({ params }: PageProps) => {
    const [module, setModule] = useState<string>();
    useEffect(() => {
        setModule(params.module)
    }, [])
    return (
        <>
            {module}
        </>
    )
}

export default Metafield