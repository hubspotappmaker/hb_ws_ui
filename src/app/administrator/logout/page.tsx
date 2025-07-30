'use client'
import { ClearUserLogin } from "@/utils/localstorage/clear.storage";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

const Logout = () => {
    const router = useRouter();
    useEffect(() => {
        ClearUserLogin();
        router.push('/administrator/signin');
    }, [])
}

export default Logout