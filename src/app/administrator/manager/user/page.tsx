'use client';
import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Pagination, message, Avatar, Space, Switch, Select, Button, Modal } from 'antd';
import {
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MailOutlined,
    CalendarOutlined,
    CrownOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { changeUserStatus, changeUserTier, deleteAccount, getAllAccount } from '@/service/admin/account';
import { getAllTier } from '@/service/admin/tier';
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
  padding: 24px;
  background-color: white;
  
  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

// Header section with title
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

// Table wrapper with responsive overflow
const TableContainer = styled.div`
  margin-top: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    overflow-x: auto;
    margin-top: 16px;
    
    .ant-table {
      min-width: 900px;
    }
    
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      white-space: nowrap;
      font-size: 12px;
      padding: 8px 12px;
    }
  }
`;

// Pagination container
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

// Styled title component
const StyledTitle = styled(Typography.Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
  }
`;

// User info container
const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

// User details
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// User name
const UserName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
`;

// User email
const UserEmail = styled.div`
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Stats container
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

// Stats card
const StatsCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// Stats number
const StatsNumber = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

// Stats label
const StatsLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// Status switch container
const StatusSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusLabel = styled.span`
  font-size: 12px;
  color: #666;
  min-width: 50px;
`;

interface Account {
    _id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    connectedApps: any[];
    tier: any;
}

interface Tier {
    _id: string;
    name: string;
    isActive: boolean;
    connectLimit: number;
    appLimit: number;
    orderSyncLimit: number;
    productSyncLimit: number;
    customerSyncLimit: number;
    metafieldLimit: number;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface AccountResponse {
    data: Account[];
    page: number;
    size: number;
    totalPage: number;
    totalRecord: number;
}

interface TierResponse {
    data: Tier[];
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

const UserManager = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [loading, setLoading] = useState(false);
    const [switchLoading, setSwitchLoading] = useState<{ [key: string]: boolean }>({});
    const [tierLoading, setTierLoading] = useState<{ [key: string]: boolean }>({});
    const isMobile = useIsMobile();
    const navigate = useRouter();
    const fetchTiers = async () => {
        try
        {
            const response = await getAllTier(1, 1000);
            console.log('Tier response:', response);

            if (response.status === 200)
            {
                const { data: tiersData } = response.data;
                setTiers(tiersData.filter((tier: Tier) => !tier.isDeleted));
            }
        } catch (error)
        {
            console.error('Error fetching tiers:', error);
            message.error('Failed to fetch tiers');
        }
    };

    const fetchAccounts = async () => {
        setLoading(true);
        try
        {
            const response = await getAllAccount(currentPage, pageSize);
            console.log('Account response:', response);

            if (response.status === 200)
            {
                const { data: accountsData, totalRecord, totalPage } = response.data;
                setAccounts(accountsData);
                setTotalRecords(totalRecord);
                setTotalPages(totalPage);
            }
        } catch (error)
        {
            console.error('Error fetching accounts:', error);
            message.error('Failed to fetch accounts');
        } finally
        {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, pageSize]);

    // Handle status change
    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        setSwitchLoading(prev => ({ ...prev, [userId]: true }));

        try
        {
            const response = await changeUserStatus(userId, newStatus);

            if (response.status === 200)
            {
                // Update local state
                setAccounts(prevAccounts =>
                    prevAccounts.map(account =>
                        account._id === userId
                            ? { ...account, isActive: newStatus }
                            : account
                    )
                );
                message.success(`User status updated to ${newStatus ? 'Active' : 'Inactive'}`);
            } else
            {
                message.error('Failed to update user status');
                // Revert the switch if the API call failed
                return false;
            }
        } catch (error)
        {
            console.error('Error updating user status:', error);
            message.error('Failed to update user status');
            return false;
        } finally
        {
            setSwitchLoading(prev => ({ ...prev, [userId]: false }));
        }

        return true;
    };

    const handleDelete = (userId: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this account?',
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try
                {
                    const response = await deleteAccount(userId);
                    if (response.status === 200)
                    {
                        message.success('Account deleted successfully');
                        // refresh table data
                        fetchAccounts();
                    } else
                    {
                        message.error('Failed to delete account');
                    }
                } catch (error)
                {
                    console.error('Error deleting account:', error);
                    message.error('Failed to delete account');
                }
            },
        });
    };


    // Handle tier change
    const handleTierChange = async (userId: string, newTierId: string) => {
        setTierLoading(prev => ({ ...prev, [userId]: true }));

        try
        {
            const response = await changeUserTier(userId, newTierId);

            if (response.status === 200)
            {
                // Find the new tier object
                const newTier = tiers.find(tier => tier._id === newTierId);

                // Update local state
                setAccounts(prevAccounts =>
                    prevAccounts.map(account =>
                        account._id === userId
                            ? { ...account, tier: newTier }
                            : account
                    )
                );
                message.success(`User tier updated to ${newTier?.name}`);
            } else
            {
                // message.error('Failed to update user tier');
            }
        } catch (error)
        {
            console.error('Error updating user tier:', error);
            message.error('Failed to update user tier');
        } finally
        {
            setTierLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Calculate stats
    const activeUsers = accounts.filter(account => account.isActive && !account.isDeleted).length;
    const verifiedUsers = accounts.filter(account => account.emailVerified).length;
    const adminUsers = accounts.filter(account => account.role === 'admin').length;

    const columns = [
        {
            title: 'Index',
            key: 'index',
            render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
            width: 80,
        },
        {
            title: 'User',
            key: 'user',
            render: (record: Account) => (
                <UserInfoContainer>
                    <UserDetails>
                        <UserName>{record.name}</UserName>
                        <UserEmail>
                            <MailOutlined />
                            {record.email}
                        </UserEmail>
                    </UserDetails>
                </UserInfoContainer>
            ),
            width: 280,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => (
                <Tag
                    color={role === 'admin' ? 'red' : 'blue'}
                    icon={role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
                >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </Tag>
            ),
            width: 100,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive: boolean, record: Account) => {
                if (record.isDeleted)
                {
                    return (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                            Deleted
                        </Tag>
                    );
                }

                return (
                    <StatusSwitchContainer>
                        <Switch
                            checked={isActive}
                            loading={switchLoading[record._id]}
                            onChange={async (checked) => {
                                const success = await handleStatusChange(record._id, checked);
                                if (!success)
                                {
                                    // Switch will automatically revert if we return false
                                }
                            }}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </StatusSwitchContainer>
                );
            },
            width: 130,
        },
        {
            title: 'Account Tier',
            dataIndex: 'tier',
            key: 'tier',
            render: (tier: any, record: Account) => {
                return (
                    <Select
                        value={tier?._id || ''}
                        style={{ width: 170 }}
                        loading={tierLoading[record._id]}
                        onChange={(value) => handleTierChange(record._id, value)}
                        placeholder="Select tier"
                        size="small"
                    >
                        {tiers.map(tierOption => (
                            <Select.Option key={tierOption._id} value={tierOption._id}>
                                {`${tierOption.name} [${tierOption.isActive ? 'Activate' : 'In Activate}'}]`}
                            </Select.Option>
                        ))}
                    </Select>
                );
            },
            width: 140,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => (
                <Space>
                    <CalendarOutlined />
                    {new Date(createdAt).toLocaleDateString()}
                </Space>
            ),
            width: 140,
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: string) => (
                <Space>
                    <CalendarOutlined />
                    {new Date(updatedAt).toLocaleDateString()}
                </Space>
            ),
            width: 140,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Account) => (
                <Space>
                    <Button type="primary" onClick={() => navigate.push(`/administrator/manager/user/statistics/${record._id}`)}>
                        Statistics
                    </Button>

                    <Button
                        onClick={() => handleDelete(record._id)}
                        style={{
                            color: 'red'
                        }}
                        type="dashed"
                        icon={<DeleteOutlined />}
                    />

                </Space>
            ),
            width: 160,
        },
    ];

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Account Management</StyledTitle>
            </HeaderContainer>

            {/* Stats Cards */}
            <StatsContainer>
                <StatsCard>
                    <StatsNumber>{totalRecords}</StatsNumber>
                    <StatsLabel>Total Users</StatsLabel>
                </StatsCard>
                <StatsCard style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <StatsNumber>{activeUsers}</StatsNumber>
                    <StatsLabel>Active Users</StatsLabel>
                </StatsCard>
                <StatsCard style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <StatsNumber>{verifiedUsers}</StatsNumber>
                    <StatsLabel>Verified Users</StatsLabel>
                </StatsCard>
                <StatsCard style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <StatsNumber>{adminUsers}</StatsNumber>
                    <StatsLabel>Admin Users</StatsLabel>
                </StatsCard>
            </StatsContainer>

            <TableContainer>
                <Table
                    columns={columns}
                    dataSource={accounts}
                    pagination={false}
                    rowKey="_id"
                    size="middle"
                    loading={loading}
                    scroll={{ x: isMobile ? 900 : undefined }}
                />
            </TableContainer>

            <PaginationContainer>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalRecords}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} users`}
                    onChange={(page) => setCurrentPage(page)}
                    onShowSizeChange={(current, size) => {
                        setCurrentPage(1);
                        setPageSize(size);
                    }}
                    pageSizeOptions={['15', '20', '25', '50']}
                />
            </PaginationContainer>
        </PageContainer>
    );
};

export default UserManager;