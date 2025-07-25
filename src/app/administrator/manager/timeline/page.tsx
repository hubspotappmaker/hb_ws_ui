'use client';
import React, { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Tag,
    Pagination,
    message,
    Space,
    Button,
    Avatar,
} from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    MailOutlined,
    CloudOutlined,
    BarChartOutlined,
    GoogleOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { getSourceAccount } from "@/service/admin/account";

// Styled components
const PageContainer = styled.div`
  padding: 24px;
  background-color: white;
  
  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    margin-bottom: 16px;
  }
`;

const TableContainer = styled.div`
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  
  .ant-table {
    min-width: 1200px;
  }
  
  @media (max-width: 768px) {
    margin-top: 16px;
    
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      white-space: nowrap;
      font-size: 12px;
      padding: 8px 12px;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    justify-content: center;
    
    .ant-pagination {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`;

const StyledTitle = styled(Typography.Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
  }
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }
`;

// Interfaces
interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    connectedApps: any[];
    tier: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Credentials {
    email?: string;
    token?: any;
    prefix?: string;
    hub_id?: string;
    refresh_token?: string;
    access_token?: string;
    fullName?: string;
    token_type: string;
}

interface SourceAccount {
    _id: string;
    platform: string;
    user: User | null;
    name: string;
    isActive: boolean;
    ModuleApp: string[];
    credentials: Credentials;
    webhookIds: any[];
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface SourceAccountResponse {
    data: SourceAccount[];
    page: number;
    size: number;
    totalPage: number;
    totalRecord: number;
}

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
};

const TimeLinePage = () => {
    const [sourceAccounts, setSourceAccounts] = useState<SourceAccount[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const isMobile = useIsMobile();

    const fetchSourceAccounts = async () => {
        setLoading(true);
        try
        {
            const response = await getSourceAccount(currentPage, pageSize);
            console.log('Source account response:', response);

            if (response.status === 200)
            {
                const { data: accountsData, totalRecord, totalPage } = response.data;
                setSourceAccounts(accountsData);
                setTotalRecords(totalRecord);
                setTotalPages(totalPage);
            }
        } catch (error)
        {
            console.error('Error fetching source accounts:', error);
            message.error('Failed to fetch source accounts');
        } finally
        {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSourceAccounts();
    }, [currentPage, pageSize]);

    // Get platform info based on token_type
    const getPlatformInfo = (credentials: Credentials) => {
        const tokenType = credentials?.token_type?.toLowerCase() || '';

        if (tokenType.includes('hubspot'))
        {
            return {
                name: 'HubSpot',
                color: '#ff6b35'
            };
        } else
        {
            return {
                name: 'Google Drive',
                color: '#4285f4'
            };
        }
    };

    // Handle statistics navigation
    const handleStatistics = (userId: string) => {
        router.push(`/administrator/manager/user/statistics/${userId}`);
    };

    const columns = [
        {
            title: 'Index',
            key: 'index',
            render: (_: any, __: any, index: number) => totalRecords - ((currentPage - 1) * pageSize + index),
            width: 80,
        },
        {
            title: 'Platform',
            key: 'platform',
            render: (record: SourceAccount) => {
                const platformInfo = getPlatformInfo(record.credentials);
                return (
                    <Space>
                        <Tag color={platformInfo.color} style={{ fontWeight: 600 }}>
                            {platformInfo.name}
                        </Tag>
                    </Space>
                );
            },
            width: 150,
        },
        {
            title: 'Account Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: SourceAccount) => (
                <Space direction="vertical" size="small">
                    {/* Tên tài khoản */}
                    <Space>
                        <CloudOutlined style={{ color: record.isActive ? '#1890ff' : '#999' }} />
                        <span style={{
                            fontWeight: 500,
                            color: record.isActive ? '#1a1a1a' : '#999'
                        }}>
                            {name || 'N/A'}
                        </span>
                    </Space>

                    {/* Email từ credentials nếu có */}
                    {record.credentials?.email && (
                        <Space>
                            <MailOutlined style={{ color: '#666' }} />
                            <span style={{ color: '#666' }}>
                                {record.credentials.email}
                            </span>
                        </Space>
                    )}
                </Space>
            ),
            width: 200,
        },
        {
            title: 'User Account',
            key: 'userAccount',
            render: (record: SourceAccount) => {
                const user = record.user;

                if (!user)
                {
                    return (
                        <Space direction="vertical" size="small">
                            <Tag color="default">No User Data</Tag>
                        </Space>
                    );
                }

                return (
                    <Space direction="vertical" size="small">
                        <Space size="small">
                            <UserOutlined />
                            <span style={{ fontWeight: 500 }}>{user.name || 'N/A'}</span>
                        </Space>
                        <Space size="small">
                            <MailOutlined />
                            <span style={{ color: '#666' }}>{user.email || 'N/A'}</span>
                        </Space>
                    </Space>
                );
            },
            width: 200,
        },
        {
            title: 'Status',
            key: 'status',
            render: (record: SourceAccount) => {
                if (record.isDeleted)
                {
                    return (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                            Deleted
                        </Tag>
                    );
                }

                return (
                    <Tag
                        color={record.isActive ? "green" : "orange"}
                        icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                        {record.isActive ? 'Connected' : 'Ready for Connect'}
                    </Tag>
                );
            },
            width: 150,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => (
                <Space>
                    <CalendarOutlined />
                    {new Date(createdAt).toLocaleString()}
                </Space>
            ),
            width: 140,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: SourceAccount) => {
                const hasUser = record.user && record.user._id;

                return (
                    <ActionButton
                        type="primary"
                        icon={<BarChartOutlined />}
                        size="small"
                        onClick={() => hasUser && handleStatistics(record.user!._id)}
                        disabled={!hasUser || record.isDeleted}
                        title={!hasUser ? 'No user data available' : 'View statistics'}
                    >
                        Statistics
                    </ActionButton>
                );
            },
            width: 120,
        },
    ];

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Source Account Timeline</StyledTitle>
                <Space>
                    <Tag color="blue">Total: {totalRecords}</Tag>
                </Space>
            </HeaderContainer>

            <TableContainer>
                <Table
                    columns={columns}
                    dataSource={sourceAccounts}
                    pagination={false}
                    rowKey="_id"
                    size="middle"
                    loading={loading}
                    scroll={{ x: 1200 }}
                />
            </TableContainer>

            <PaginationContainer>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalRecords}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} source accounts`}
                    onChange={(page) => setCurrentPage(page)}
                    onShowSizeChange={(current, size) => {
                        setCurrentPage(1);
                        setPageSize(size);
                    }}
                    pageSizeOptions={['25', '50', '75', '100']}
                />
            </PaginationContainer>
        </PageContainer>
    );
};

export default TimeLinePage;