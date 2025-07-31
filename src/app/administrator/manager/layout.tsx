'use client'
import AdminMenu from "@/component/admin/admin.menu";
import { pingMe } from "@/service/user/auth";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [menuCollapsed, setMenuCollapsed] = useState(true);

    const ping = async () => {
        const response = await pingMe();

        switch (response.status) {
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
            if (mobile) {
                setMenuCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const menuWidth = isMobile ? (menuCollapsed ? 0 : 280) : (menuCollapsed ? 80 : 280);

    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            {/* Mobile Overlay */}
            {isMobile && !menuCollapsed && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                    }}
                    onClick={() => setMenuCollapsed(true)}
                />
            )}

            {/* Menu Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: menuCollapsed && isMobile ? -280 : 0,
                    width: menuCollapsed ? 80 : 280,
                    height: '100vh',
                    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
                    boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    zIndex: 1000,
                    transition: 'left 0.3s ease-in-out, width 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <AdminMenu
                    onMenuClick={() => isMobile && setMenuCollapsed(true)}
                    isMobile={isMobile}
                    collapsed={menuCollapsed}
                    onCollapse={setMenuCollapsed}
                />
            </div>

            {/* Main Content */}
            <div
                style={{
                    marginLeft: isMobile ? 0 : menuWidth,
                    height: '100vh',
                    overflowY: 'auto',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    position: 'relative',
                }}
            >
                {/* Mobile Header */}
                {isMobile && (
                    <div
                        style={{
                            position: 'sticky',
                            top: 0,
                            height: '60px',
                            background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                        }}
                    >
                        <button
                            onClick={() => setMenuCollapsed(!menuCollapsed)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '18px',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '6px',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            ☰
                        </button>
                        <img
                            src="https://shopify.nexce.io/connect-platform-app/application/get-avatar/dummy.png"
                            alt="nexce.io"
                            style={{ height: '28px', marginLeft: '16px' }}
                        />
                    </div>
                )}

                {/* Content Area */}
                <div
                    style={{
                        padding: isMobile ? '16px' : '24px',
                        minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}