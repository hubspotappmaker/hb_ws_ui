'use client';
import React, { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Tag,
    Pagination,
    message,
    Space,
    Switch,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
} from 'antd';
import {
    EditOutlined,
    PlusOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CrownOutlined,
    AppstoreOutlined,
    LinkOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TagOutlined,
    InsertRowBelowOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { createTier, getAllTier, getTierDetail, updateTier } from "@/service/admin/tier";

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
  
  @media (max-width: 768px) {
    overflow-x: auto;
    margin-top: 16px;
    
    .ant-table {
      min-width: 1000px;
    }
    
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
interface CreateTierDto {
    name: string;
    connectLimit: number;
    appLimit: number;
}

type UpdateTierDto = Partial<CreateTierDto>;

interface Tier {
    _id: string;
    name: string;
    isActive: boolean;
    connectLimit: number;
    appLimit: number;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
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

const TierManager = () => {
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [loading, setLoading] = useState(false);
    const [switchLoading, setSwitchLoading] = useState<{ [key: string]: boolean }>({});

    // Modal states
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    const [form] = Form.useForm();
    const isMobile = useIsMobile();

    const fetchTiers = async () => {
        setLoading(true);
        try
        {
            const response = await getAllTier(currentPage, pageSize);
            console.log('Tier response:', response);

            if (response.status === 200)
            {
                const { data: tiersData, totalRecord, totalPage } = response.data;
                setTiers(tiersData);
                setTotalRecords(totalRecord);
                setTotalPages(totalPage);
            }
        } catch (error)
        {
            console.error('Error fetching tiers:', error);
            message.error('Failed to fetch tiers');
        } finally
        {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, [currentPage, pageSize]);

    // Handle status change
    const handleStatusChange = async (tierId: string, newStatus: boolean) => {
        setSwitchLoading(prev => ({ ...prev, [tierId]: true }));

        try
        {
            const response = await updateTier(tierId, { isActive: newStatus } as UpdateTierDto);

            if (response.status === 200)
            {
                setTiers(prevTiers =>
                    prevTiers.map(tier =>
                        tier._id === tierId
                            ? { ...tier, isActive: newStatus }
                            : tier
                    )
                );
                message.success(`Tier status updated to ${newStatus ? 'Active' : 'Inactive'}`);
            } else
            {
                // message.error('Failed to update tier status');
                return false;
            }
        } catch (error)
        {
            console.error('Error updating tier status:', error);
            // message.error('Failed to update tier status');
            return false;
        } finally
        {
            setSwitchLoading(prev => ({ ...prev, [tierId]: false }));
        }

        return true;
    };

    // Handle edit
    const handleEdit = async (tierId: string) => {
        setModalLoading(true);
        try
        {
            const response = await getTierDetail(tierId);
            if (response.status === 200)
            {
                const tierData = response.data;
                setSelectedTier(tierData);
                form.setFieldsValue({
                    name: tierData.name,
                    connectLimit: tierData.connectLimit,
                    appLimit: tierData.appLimit,
                    orderSyncLimit: tierData.orderSyncLimit,
                    productSyncLimit: tierData.productSyncLimit,
                    customerSyncLimit: tierData.customerSyncLimit,
                    companySyncLimit: tierData.companySyncLimit,
                    metafieldLimit: tierData.metafieldLimit,
                });
                setIsEditModalVisible(true);
            }
        } catch (error)
        {
            console.error('Error fetching tier detail:', error);
            message.error('Failed to fetch tier details');
        } finally
        {
            setModalLoading(false);
        }
    };

    // Handle create/update submit
    const handleSubmit = async (values: CreateTierDto) => {
        setModalLoading(true);
        try
        {
            let response;
            if (selectedTier)
            {
                // Update
                response = await updateTier(selectedTier._id, values);
            } else
            {
                // Create
                response = await createTier(values);
            }

            if (response.status === 200 || response.status === 201)
            {
                message.success(`Tier ${selectedTier ? 'updated' : 'created'} successfully`);
                setIsCreateModalVisible(false);
                setIsEditModalVisible(false);
                form.resetFields();
                setSelectedTier(null);
                fetchTiers(); // Refresh the list
            } else
            {
                message.error(`Failed to ${selectedTier ? 'update' : 'create'} tier`);
            }
        } catch (error)
        {
            console.error(`Error ${selectedTier ? 'updating' : 'creating'} tier:`, error);
            message.error(`Failed to ${selectedTier ? 'update' : 'create'} tier`);
        } finally
        {
            setModalLoading(false);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsCreateModalVisible(false);
        setIsEditModalVisible(false);
        setSelectedTier(null);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Index',
            key: 'index',
            render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
            width: 80,
        },
        {
            title: 'Tier Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Tier) => (
                <Space>
                    <CrownOutlined style={{ color: record.isActive ? '#1890ff' : '#999' }} />
                    <Tag style={{ fontWeight: 600, color: record.isActive ? '#1a1a1a' : '#999' }}>
                        {name}
                    </Tag>
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Limits',
            key: 'limits',
            render: (record: Tier) => (
                <Space direction="vertical" size="small">
                    <Space size="small">
                        <LinkOutlined />
                        <Tag color='green'>Connect: {record.connectLimit}</Tag>
                    </Space>
                    <Space size="small">
                        <AppstoreOutlined />
                        <Tag color='orange'>Apps: {record.appLimit}</Tag>
                    </Space>
                </Space>
            ),
            width: 120,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive: boolean, record: Tier) => {
                if (record.isDeleted)
                {
                    return (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                            Deleted
                        </Tag>
                    );
                }

                return (
                    <Switch
                        checked={isActive}
                        loading={switchLoading[record._id]}
                        onChange={async (checked) => {
                            await handleStatusChange(record._id, checked);
                        }}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                );
            },
            width: 120,
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
            title: 'Actions',
            key: 'actions',
            render: (record: Tier) => (
                <ActionButton
                    color='volcano'
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(record._id)}
                    // loading={modalLoading}
                    disabled={record.isDeleted}
                >
                    Edit
                </ActionButton>
            ),
            width: 100,
        },
    ];

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Tier Management</StyledTitle>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Create New Tier
                </Button>
            </HeaderContainer>

            <TableContainer>
                <Table
                    columns={columns}
                    dataSource={tiers}
                    pagination={false}
                    rowKey="_id"
                    size="middle"
                    loading={loading}
                    scroll={{ x: isMobile ? 1000 : undefined }}
                />
            </TableContainer>

            <PaginationContainer>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalRecords}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `Total ${total} tiers`}
                    onChange={(page) => setCurrentPage(page)}
                    onShowSizeChange={(current, size) => {
                        setCurrentPage(1);
                        setPageSize(size);
                    }}
                    pageSizeOptions={['15', '20', '25', '50']}
                />
            </PaginationContainer>

            {/* Create/Edit Modal */}
            <Modal
                title={selectedTier ? "Edit Tier" : "Create New Tier"}
                open={isCreateModalVisible || isEditModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tier Name"
                        rules={[{ required: true, message: 'Please enter tier name' }]}
                    >
                        <Input placeholder="Enter tier name" />
                    </Form.Item>

                    <Form.Item
                        name="connectLimit"
                        label="Connect Limit"
                        rules={[{ required: true, message: 'Please enter connect limit' }]}
                    >
                        <InputNumber min={1} placeholder="Enter connect limit" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="appLimit"
                        label="App Limit"
                        rules={[{ required: true, message: 'Please enter app limit' }]}
                    >
                        <InputNumber min={1} placeholder="Enter app limit" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={modalLoading}>
                                {selectedTier ? 'Update' : 'Create'} Tier
                            </Button>
                            <Button onClick={handleModalClose}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
};

export default TierManager;