'use client'

import React from 'react';
import {
  SettingOutlined,
  DatabaseOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  ForkOutlined,
  HistoryOutlined,
  ApiOutlined,
  ImportOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';

type CustomMenuItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: CustomMenuItem[];
  type?: string;
};

const customItems: CustomMenuItem[] = [
  {
    key: 'sub3',
    type: 'group',
    label: 'Configuration',
    children: [
      { key: '15', label: 'Source', icon: <ForkOutlined />, path: '/home/source' },
      { key: '16', label: 'Connect', icon: <ApiOutlined />, path: '/home/connect' },
      // { key: '17', label: 'History', icon: <HistoryOutlined />, path: '/home/history' },
    ],
  },
  {
    key: 'sub5',
    type: 'group',
    label: 'Support',
    children: [
      { key: '13', label: 'User guide', icon: <BookOutlined />, path: 'guide' },
      { key: '11', label: 'Contact', icon: <PhoneOutlined />, path: 'contact' },
      { key: '12', label: 'Billing', icon: <CreditCardOutlined />, path: '/home/billing' },
      { key: '14', label: 'Logout', icon: <LogoutOutlined />, path: '/logout' },
    ],
  },
];

// Convert our CustomMenuItem tree into AntD's MenuProps.items format
const mapToAntdItems = (items: CustomMenuItem[]): MenuProps['items'] => {
  const mapped = items.map(item => {
    const { path, ...rest } = item;
    return {
      ...rest,
      children: item.children ? mapToAntdItems(item.children) : undefined,
    };
  });
  return mapped as MenuProps['items'];
};

interface HomeMenuProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ onMenuClick, isMobile = false }) => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    // For artifacts demo, we'll use a sample email instead of localStorage
    const storedEmail = localStorage.getItem('email');
    setEmail(storedEmail);
  }, []);

  const onClick: MenuProps['onClick'] = e => {
    const findItem = (items: CustomMenuItem[]): CustomMenuItem | undefined => {
      for (const i of items)
      {
        if (i.key === e.key) return i;
        if (i.children)
        {
          const found = findItem(i.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const clicked = findItem(customItems);
    if (clicked?.path)
    {
      router.push(clicked.path);
      onMenuClick?.(); // Close menu on mobile after click
    }
  };

  const menuStyles = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
  };

  const menuItemStyles = `
    .ant-menu-dark .ant-menu-item {
      color: rgba(255, 255, 255, 0.85) !important;
      border-radius: 8px !important;
      margin: 4px 8px !important;
      padding: 0 16px !important;
      height: 44px !important;
      line-height: 44px !important;
      transition: all 0.2s ease !important;
    }
    
    .ant-menu-dark .ant-menu-item:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      transform: translateX(4px) !important;
    }
    
    .ant-menu-dark .ant-menu-item-selected {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
    }
    
    .ant-menu-dark .ant-menu-item-group-title {
      color: rgba(255, 255, 255, 0.7) !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      padding: 16px 16px 8px 16px !important;
      margin-top: 16px !important;
    }
    
    .ant-menu-dark .ant-menu-item-group:first-of-type .ant-menu-item-group-title {
      margin-top: 8px !important;
    }
    
    .ant-menu-dark .ant-menu-item .anticon {
      font-size: 16px !important;
      margin-right: 12px !important;
    }
    
    .ant-menu-dark {
      background: transparent !important;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: menuStyles }} />
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'transparent'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '16px' : '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}>
          <img
            src="https://nexce.io/wp-content/uploads/2025/06/cropped-cropped-NEX-3-e1750753156187.png"
            alt="Nexce Digital"
            style={{
              height: isMobile ? '28px' : '32px',
              // filter: 'brightness(0) invert(1)',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Menu Section */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          <Menu
            onClick={onClick}
            mode="inline"
            theme="dark"
            items={mapToAntdItems(customItems)}
            style={menuStyles}
          />
        </div>

        {/* User Info Section */}
        {email && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                {email.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {email}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                  marginTop: '2px',
                }}>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeMenu;