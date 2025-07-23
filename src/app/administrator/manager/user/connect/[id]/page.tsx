'use client'
import { getConnectByUser } from "@/service/user/source";
import { useEffect, useState } from "react";
import { Table, Typography, Space, Spin, Alert, Tag, Button, Modal, Descriptions, Pagination } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, EyeOutlined, LeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// Styled Components (same as Connect component)
const PageContainer = styled.div`
  padding: 24px;
  background-color: white;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    margin-bottom: 20px;
  }
`;

const TableContainer = styled.div`
  margin-top: 24px;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    margin-top: 16px;
    overflow-x: auto;
    
    .ant-table {
      min-width: 800px;
    }
    
    .ant-table-tbody > tr > td {
      white-space: nowrap;
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
    
    .ant-pagination-options {
      margin-left: 8px;
    }
  }
`;

const StyledTitle = styled(Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
  
  @media (max-width: 768px) {
    font-size: 24px !important;
    text-align: center;
  }
`;

const ActionButtonGroup = styled(Space)`
  @media (max-width: 768px) {
    gap: 4px !important;
    
    .ant-btn {
      padding: 4px 6px;
      height: auto;
      min-width: auto;
      
      .anticon {
        font-size: 12px;
      }
    }
  }
`;

const ResponsiveModal = styled(Modal)`
  @media (max-width: 768px) {
    .ant-modal {
      max-width: calc(100vw - 32px);
      margin: 0 auto;
      top: 20px;
    }
    
    .ant-modal-content {
      margin: 0;
    }
    
    .ant-modal-header {
      padding: 16px 20px;
      
      .ant-modal-title {
        font-size: 16px;
      }
    }
    
    .ant-modal-body {
      padding: 16px 20px;
    }
    
    .ant-modal-footer {
      padding: 12px 20px;
      
      .ant-btn {
        height: 36px;
        font-size: 14px;
      }
    }
  }
`;

const StatsContainer = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`;

interface ConnectionData {
    _id: string;
    user: string;
    from: {
        _id: string;
        platform: string;
        name: string;
        isActive: boolean;
        credentials: {
            email?: string;
            fullName?: string;
            hub_id?: string;
            [key: string]: any;
        };
        createdAt: string;
        updatedAt: string;
    };
    to: {
        _id: string;
        platform: string;
        name: string;
        isActive: boolean;
        credentials: {
            email?: string;
            [key: string]: any;
        };
        createdAt: string;
        updatedAt: string;
    };
    name: string;
    isSyncing: boolean;
    migratedContacts: number;
    migratedOrders: number;
    migratedProducts: number;
    syncMetafield: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    params: {
        id: string;
    };
}

const ConnectionByUser: React.FC<Props> = ({ params }) => {
    const [connections, setConnections] = useState<ConnectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<ConnectionData | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try
            {
                setLoading(true);
                const response = await getConnectByUser(params.id);

                if (response.status === 200)
                {
                    setConnections(response.data);
                    setError(null);
                } else
                {
                    setError('Failed to fetch connections');
                }
            } catch (err)
            {
                setError('Error fetching connections: ' + (err as Error).message);
            } finally
            {
                setLoading(false);
            }
        };

        if (params.id)
        {
            fetchConnections();
        }
    }, [params.id]);

    const showDetailModal = (connection: ConnectionData) => {
        setSelectedConnection(connection);
        setDetailModalVisible(true);
    };

    const columns: ColumnsType<ConnectionData> = [
        {
            title: 'Index',
            key: 'index',
            width: 80,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Connection Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'From',
            key: 'from',
            render: (_, record: ConnectionData) => (
                <Space direction="vertical" size="small">
                    <Text>{record.from.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.from.credentials.email || 'No email'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'To',
            key: 'to',
            render: (_, record: ConnectionData) => (
                <Space direction="vertical" size="small">
                    <Text>{record.to.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.to.credentials.email || 'No email'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record: ConnectionData) => (
                <Space direction="vertical" size="small">
                    <Tag
                        color={record.isActive ? "green" : "red"}
                        icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                        {record.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                    {record.isSyncing && (
                        <Tag color="processing" icon={<SyncOutlined spin />}>
                            Syncing
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'actions',
            render: (_, record: ConnectionData) => (
                <ActionButtonGroup>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showDetailModal(record)}
                        size="small"
                    >
                        Details
                    </Button>
                </ActionButtonGroup>
            ),
        },
    ];

    // Pagination
    const paginatedData = connections.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (loading)
    {
        return (
            <PageContainer>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px'
                }}>
                    <Spin size="large" />
                </div>
            </PageContainer>
        );
    }

    if (error)
    {
        return (
            <PageContainer>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Button
                icon={<LeftOutlined />}
                onClick={() => window.history.back()}
                style={{ border: '1px solid rgb(22, 119, 255)', color: 'rgb(22, 119, 255)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}
            >
                Back
            </Button>
            <HeaderContainer>
                <StyledTitle level={2}>User Connections</StyledTitle>
            </HeaderContainer>

            <StatsContainer>
                <Text>Total connections: <strong>{connections.length}</strong></Text>
            </StatsContainer>

            {connections.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px 0',
                    color: '#666'
                }}>
                    <Text>No connections found for this user.</Text>
                </div>
            ) : (
                <>
                    <TableContainer>
                        <Table
                            columns={columns}
                            dataSource={paginatedData}
                            rowKey="_id"
                            pagination={false}
                            size="middle"
                        />
                    </TableContainer>

                    <PaginationContainer>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={connections.length}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `Total ${total} connections`}
                            onChange={(page) => setCurrentPage(page)}
                            onShowSizeChange={(current, size) => {
                                setCurrentPage(1);
                                setPageSize(size);
                            }}
                            pageSizeOptions={['15', '20', '25']}
                        />
                    </PaginationContainer>
                </>
            )}

            {/* Detail Modal */}
            <ResponsiveModal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#1667ff',
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                            }}
                        >
                            <EyeOutlined style={{ fontSize: '16px', color: 'white' }} />
                        </div>
                        <span>Connection Details</span>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}
            >
                {selectedConnection && (
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Connection Name" span={2}>
                            <Text strong>{selectedConnection.name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Connection ID" span={2}>
                            <Text code>{selectedConnection._id}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="From Platform">
                            <Space direction="vertical" size="small">
                                <Text strong>{selectedConnection.from.name}</Text>
                                <Text type="secondary">Platform: {selectedConnection.from.platform}</Text>
                                <Tag color={selectedConnection.from.isActive ? "green" : "red"}>
                                    {selectedConnection.from.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Platform">
                            <Space direction="vertical" size="small">
                                <Text strong>{selectedConnection.to.name}</Text>
                                <Text type="secondary">Platform: {selectedConnection.to.platform}</Text>
                                <Tag color={selectedConnection.to.isActive ? "green" : "red"}>
                                    {selectedConnection.to.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="From Credentials">
                            <Space direction="vertical" size="small">
                                {selectedConnection.from.credentials.email && (
                                    <Text>Email: {selectedConnection.from.credentials.email}</Text>
                                )}
                                {selectedConnection.from.credentials.fullName && (
                                    <Text>Full Name: {selectedConnection.from.credentials.fullName}</Text>
                                )}
                                {selectedConnection.from.credentials.hub_id && (
                                    <Text>Hub ID: {selectedConnection.from.credentials.hub_id}</Text>
                                )}
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Credentials">
                            <Space direction="vertical" size="small">
                                {selectedConnection.to.credentials.email && (
                                    <Text>Email: {selectedConnection.to.credentials.email}</Text>
                                )}
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Connection Status">
                            <Space>
                                <Tag color={selectedConnection.isActive ? "green" : "red"}
                                    icon={selectedConnection.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                                    {selectedConnection.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                                {selectedConnection.isSyncing && (
                                    <Tag color="processing" icon={<SyncOutlined spin />}>
                                        Syncing
                                    </Tag>
                                )}
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Sync Metafield">
                            <Tag color={selectedConnection.syncMetafield ? "green" : "red"}>
                                {selectedConnection.syncMetafield ? 'Enabled' : 'Disabled'}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Migrated Contacts">
                            <Text strong>{selectedConnection.migratedContacts}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Migrated Orders">
                            <Text strong>{selectedConnection.migratedOrders}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Migrated Products">
                            <Text strong>{selectedConnection.migratedProducts}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Is Deleted">
                            <Tag color={selectedConnection.isDeleted ? "red" : "green"}>
                                {selectedConnection.isDeleted ? 'Yes' : 'No'}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Created At">
                            <Text>{new Date(selectedConnection.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Updated At">
                            <Text>{new Date(selectedConnection.updatedAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="From Created At">
                            <Text>{new Date(selectedConnection.from.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Created At">
                            <Text>{new Date(selectedConnection.to.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </ResponsiveModal>
        </PageContainer>
    );
};

export default ConnectionByUser;