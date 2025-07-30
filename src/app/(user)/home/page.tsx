'use client'

import { pingMe } from "@/service/user/auth"
import { useRouter } from "next/navigation";
import { useEffect } from "react"

const Home = () => {
    const router = useRouter();
    useEffect(() => {
        pingMe()
        router.push('/home/source');
    }, [])
    return (
        <>
        </>
    )
}

export default Home