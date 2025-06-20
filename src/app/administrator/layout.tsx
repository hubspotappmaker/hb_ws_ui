'use client'
import HomeMenu from "@/component/home/home.menu"
import { pingMe } from "@/service/user/auth";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [menuCollapsed, setMenuCollapsed] = useState(false);

    const ping = async () => {
        const response = await pingMe();

        switch (response.status)
        {
            case 200:
                return;

            case 401:
                message.info('Your session has expired. Please log in again.');
                router.push('/administrator/signin');
                break;

            case 403:
                router.push('/403');
                break;

            default:
                message.error('An unexpected error occurred. Please try again later.');
                console.error('pingMe returned status', response.status);
        }
    }

    useEffect(() => {
        ping();

        // Check screen size
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile)
            {
                setMenuCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuWidth = isMobile ? (menuCollapsed ? 0 : 280) : 280;

    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            {children}
        </div>
    )
}