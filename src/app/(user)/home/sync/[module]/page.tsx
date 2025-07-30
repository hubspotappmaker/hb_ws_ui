'use client'
import { useEffect, useState } from "react";

interface PageProps {
    params: { module: string };
}
const Sync = ({ params }: PageProps) => {
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


export default Sync