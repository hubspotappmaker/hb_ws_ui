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
import {Layout, Menu} from 'antd';
import { useRouter } from 'next/navigation';
import {Content, Header} from "antd/es/layout/layout";

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
const layoutStyle = {
  borderRadius: 8,
  // overflow: 'hidden',
  // width: 'calc(50% - 8px)',
  // maxWidth: 'calc(50% - 8px)',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const First = ({ }) => {


  return (
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>How to connect to HubSpot</Header>
        <Content style={contentStyle}>


        </Content>
      </Layout>
  );
};

export default First;