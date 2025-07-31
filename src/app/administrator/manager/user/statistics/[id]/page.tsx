'use client'
import { getConnectByUser, getSourceByUser } from "@/service/user/source";
import { useEffect, useState } from "react";
import { Select, Table, Typography, Space, Spin, Alert, Tag, Button, Modal, Descriptions, Pagination, Card, Row, Col, Statistic, Collapse, Tooltip, Divider, Switch } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, EyeOutlined, LeftOutlined, DatabaseOutlined, LinkOutlined, BarChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import type { ColumnsType } from 'antd/es/table';
import { checkExpired, countUploadAction, setExpiredDate, setExpiredStatus } from "@/service/admin/account";
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
const { Title, Text } = Typography;
const { Panel } = Collapse;

// Styled Components
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

const StatisticsContainer = styled.div`
  margin-bottom: 24px;
  
  .ant-card {
    height: 100%;
    
    .ant-card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 80px;
    }
    
    .ant-statistic {
      .ant-statistic-title {
        font-size: 12px;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
        
        @media (max-width: 768px) {
          font-size: 11px;
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
      }
      
      .ant-statistic-content {
        .ant-statistic-content-value {
          font-size: 20px;
          line-height: 1.2;
          
          @media (max-width: 768px) {
            font-size: 18px;
          }
          
          @media (max-width: 576px) {
            font-size: 16px;
          }
        }
        
        .ant-statistic-content-prefix {
          font-size: 16px;
          margin-right: 4px;
          
          @media (max-width: 768px) {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  @media (max-width: 576px) {
    .ant-card-body {
      padding: 12px;
      min-height: 70px;
    }
  }
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

interface SourceData {
    _id: string;
    platform: string;
    user: string;
    name: string;
    isActive: boolean;
    ModuleApp: string[];
    credentials: {
        hub_id?: string;
        refresh_token?: string;
        access_token?: string;
        email?: string;
        fullName?: string;
        prefix?: string;
        token_type?: string;
        token?: {
            access_token?: string;
            token_type?: string;
            installed_date?: string;
            folder_id?: string;
        };
        [key: string]: any;
    };
    webhookIds: string[];
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    params: {
        id: string;
    };
}

const StatisticsPage: React.FC<Props> = ({ params }) => {
    const [connections, setConnections] = useState<ConnectionData[]>([]);
    const [sources, setSources] = useState<SourceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentConnectionPage, setCurrentConnectionPage] = useState(1);
    const [currentSourcePage, setCurrentSourcePage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [sourceDetailModalVisible, setSourceDetailModalVisible] = useState(false);
    const [selectedConnection, setSelectedConnection] = useState<ConnectionData | null>(null);
    const [selectedSource, setSelectedSource] = useState<SourceData | null>(null);
    //filter
    const [connectionDeletedFilter, setConnectionDeletedFilter] = useState<string>('all');
    const [sourceDeletedFilter, setSourceDeletedFilter] = useState<string>('all');
    //expired manager
    const [expiredData, setExpiredData] = useState<{
        isExpired: boolean;
        expiredDate: string;
        name: string;
        email: string;
    } | null>(null);
    const [expiredLoading, setExpiredLoading] = useState(false);
    // Xóa state datePickerVisible
    const [uploadCount, setUploadCount] = useState<number>(0);
    const [uploadRecords, setUploadRecords] = useState<any[]>([]); // lưu record
    const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const fetchExpiredData = async () => {
        try {
            setExpiredLoading(true);
            const response = await checkExpired(params.id);
            if (response.status === 200) {
                console.log("ched setExpiredData: ", response)
                setExpiredData(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch expired status');
            console.error('Error fetching expired data:', error);
        } finally {
            setExpiredLoading(false);
        }
    };

    const handleExpiredStatusChange = async (checked: boolean) => {
        try {
            setExpiredLoading(true);
            const response = await setExpiredStatus(params.id, checked);
            if (response.status === 200) {
                message.success(`Expired status ${checked ? 'enabled' : 'disabled'} successfully`);
                // Refresh expired data
                await fetchExpiredData();
            }
        } catch (error) {
            message.error('Failed to update expired status');
            console.error('Error updating expired status:', error);
        } finally {
            setExpiredLoading(false);
        }
    };


    const handleExpiredDateChange = async (date: any) => {
        if (!date) return;

        // Cập nhật local UI ngay lập tức
        setExpiredData(prev => prev ? { ...prev, expiredDate: date.toISOString() } : prev);

        try {
            setExpiredLoading(true);
            const response = await setExpiredDate(params.id, date.toDate());
            if (response.status === 200) {
                message.success('Expired date updated successfully');
                // Force refresh from server
                await fetchExpiredData(); // Fetch fresh data
            }
        } catch (error) {
            message.error('Failed to update expired date');
            console.error('Error updating expired date:', error);
        } finally {
            setExpiredLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [connectionsResponse, sourcesResponse, uploadCountResponse] = await Promise.all([
                    getConnectByUser(params.id),
                    getSourceByUser(params.id),
                    countUploadAction(params.id),
                ]);

                if (connectionsResponse.status === 200) {
                    setConnections(connectionsResponse.data);
                }

                if (sourcesResponse.status === 200) {
                    setSources(sourcesResponse.data);
                }
                if (uploadCountResponse.status === 200) {
                    setUploadCount(uploadCountResponse.data.count || 0);
                    setUploadRecords(uploadCountResponse.data.record || []);
                }

                // Fetch expired data
                await fetchExpiredData();

                setError(null);
            } catch (err) {
                setError('Error fetching data: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const getFilteredConnections = () => {
        if (connectionDeletedFilter === 'deleted') {
            return connections.filter(c => c.isDeleted);
        } else if (connectionDeletedFilter === 'active') {
            return connections.filter(c => !c.isDeleted);
        }
        return connections; // 'all'
    };

    const getFilteredSources = () => {
        if (sourceDeletedFilter === 'deleted') {
            return sources.filter(s => s.isDeleted);
        } else if (sourceDeletedFilter === 'active') {
            return sources.filter(s => !s.isDeleted);
        }
        return sources; // 'all'
    };

    const filteredConnections = getFilteredConnections();
    const filteredSources = getFilteredSources();

    const paginatedConnections = filteredConnections.slice(
        (currentConnectionPage - 1) * pageSize,
        currentConnectionPage * pageSize
    );

    const paginatedSources = filteredSources.slice(
        (currentSourcePage - 1) * pageSize,
        currentSourcePage * pageSize
    );

    const handleConnectionFilterChange = (value: string) => {
        setConnectionDeletedFilter(value);
        setCurrentConnectionPage(1); // Reset về trang 1
    };

    const handleSourceFilterChange = (value: string) => {
        setSourceDeletedFilter(value);
        setCurrentSourcePage(1); // Reset về trang 1
    };

    const ConnectionsHeader = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LinkOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                <span style={{ fontWeight: 600 }}>Connections ({filteredConnections.length})</span>
            </div>
            <Select
                value={connectionDeletedFilter}
                onChange={handleConnectionFilterChange}
                style={{ width: 120 }}
                size="small"
                onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
            >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="deleted">Deleted</Select.Option>
            </Select>
        </div>
    );

    const SourcesHeader = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <DatabaseOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                <span style={{ fontWeight: 600 }}>Sources ({filteredSources.length})</span>
            </div>
            <Select
                value={sourceDeletedFilter}
                onChange={handleSourceFilterChange}
                style={{ width: 120 }}
                size="small"
                onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
            >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="deleted">Deleted</Select.Option>
            </Select>
        </div>
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [connectionsResponse, sourcesResponse] = await Promise.all([
                    getConnectByUser(params.id),
                    getSourceByUser(params.id)
                ]);

                if (connectionsResponse.status === 200) {
                    setConnections(connectionsResponse.data);
                }

                if (sourcesResponse.status === 200) {
                    setSources(sourcesResponse.data);
                }

                setError(null);
            } catch (err) {
                setError('Error fetching data: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    // Statistics calculations
    const connectionStats = {
        total: connections.length,
        active: connections.filter(c => c.isActive).length,
        inactive: connections.filter(c => !c.isActive).length,
        syncing: connections.filter(c => c.isSyncing).length,
        deleted: connections.filter(c => c.isDeleted).length
    };

    const sourceStats = {
        total: sources.length,
        active: sources.filter(s => s.isActive).length,
        inactive: sources.filter(s => !s.isActive).length,
        hubspot: sources.filter(s => s?.credentials?.token_type === 'hubspot_access_token' ||
            s?.credentials?.token?.token_type === 'hubspot_access_token').length,
        googledrive: sources.filter(s => s?.credentials?.token_type === 'google_access_token' ||
            s?.credentials?.token?.token_type === 'google_access_token').length,
        deleted: sources.filter(s => s.isDeleted).length
    };

    const getPlatformType = (source: SourceData) => {
        if (source?.credentials?.token_type === 'hubspot_access_token' ||
            source?.credentials?.token?.token_type === 'hubspot_access_token') {
            return 'HubSpot';
        }
        if (source?.credentials?.token_type === 'google_access_token' ||
            source?.credentials?.token?.token_type === 'google_access_token') {
            return 'Google Drive';
        }
        return 'Unknown';
    };

    const showConnectionDetailModal = (connection: ConnectionData) => {
        setSelectedConnection(connection);
        setDetailModalVisible(true);
    };

    const showSourceDetailModal = (source: SourceData) => {
        setSelectedSource(source);
        setSourceDetailModalVisible(true);
    };

    const connectionColumns: ColumnsType<ConnectionData> = [
        {
            title: 'Index',
            key: 'index',
            width: 80,
            render: (_, __, index) => (currentConnectionPage - 1) * pageSize + index + 1,
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
                    <Text>{record?.from?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.from?.credentials?.email || 'No email'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'To',
            key: 'to',
            render: (_, record: ConnectionData) => (
                <Space direction="vertical" size="small">
                    <Text>{record?.to?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.to?.credentials?.email || 'No email'}
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
            title: 'Delete',
            key: 'delete',
            render: (_, record: ConnectionData) => (
                <Space direction="vertical" size="small">
                    <Tag
                        color={record.isDeleted ? "red" : "green"}
                        icon={record.isDeleted ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                        {record.isDeleted ? 'True' : 'False'}
                    </Tag>
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
                        onClick={() => showConnectionDetailModal(record)}
                        size="small"
                    >
                        Details
                    </Button>
                </ActionButtonGroup>
            ),
        },
    ];

    const sourceColumns: ColumnsType<SourceData> = [
        {
            title: 'Index',
            key: 'index',
            width: 80,
            render: (_, __, index) => (currentSourcePage - 1) * pageSize + index + 1,
        },
        {
            title: 'Source Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Platform',
            key: 'platform',
            render: (_, record: SourceData) => (
                <Tag color={getPlatformType(record) === 'HubSpot' ? 'orange' : 'blue'}>
                    {getPlatformType(record)}
                </Tag>
            ),
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, record: SourceData) => (
                <Text type="secondary">
                    {record?.credentials?.email || 'No email'}
                </Text>
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
            render: (_, record: SourceData) => (
                <Space direction="vertical" size="small">
                    <Tag
                        color={record.isActive ? "green" : "red"}
                        icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                        {record.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, record: SourceData) => (
                <Space direction="vertical" size="small">
                    <Tag
                        color={record.isDeleted ? "red" : "green"}
                        icon={record.isDeleted ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                        {record.isDeleted ? 'True' : 'False'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'actions',
            render: (_, record: SourceData) => (
                <ActionButtonGroup>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showSourceDetailModal(record)}
                        size="small"
                    >
                        Details
                    </Button>
                </ActionButtonGroup>
            ),
        },
    ];


    if (loading) {
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

    if (error) {
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
                style={{
                    border: '1px solid rgb(22, 119, 255)',
                    color: 'rgb(22, 119, 255)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#ffffff',
                    marginBottom: 16
                }}
            >
                Back
            </Button>

            <HeaderContainer>
                <StyledTitle level={2}>User Statistics Dashboard</StyledTitle>
            </HeaderContainer>

            {expiredData && (
                <StatisticsContainer>
                    <div style={{ marginBottom: 26 }}>
                        <Tag color="green">
                            <Text><b>User: </b>{expiredData.name || 'N/A'}</Text>
                        </Tag>
                        <Tag color="green">
                            <Text><b>Email: </b>{expiredData.email || 'N/A'}</Text>
                        </Tag>
                    </div>
                </StatisticsContainer>
            )}

            {/* Statistics Overview */}


            <StatisticsContainer>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Total Connections"
                                value={connectionStats.total}
                                prefix={<LinkOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Active"
                                value={connectionStats.active}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Inactive"
                                value={connectionStats.inactive}
                                prefix={<CloseCircleOutlined />}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Syncing"
                                value={connectionStats.syncing}
                                prefix={<SyncOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Deleted"
                                value={connectionStats.deleted}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#13c2c2' }}
                            />
                        </Card>
                    </Col>
                    {/* Thêm card hiển thị số lần upload */}
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Card>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Statistic
                                    title="Upload Count"
                                    value={uploadCount}
                                    prefix={<BarChartOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                    style={{ marginBottom: 0 }}
                                />
                                <Tooltip title="View upload details">
                                    <Button
                                        icon={<EyeOutlined />}
                                        onClick={() => setUploadModalVisible(true)}
                                        size="small"
                                        style={{ marginLeft: 8 }}
                                    />
                                </Tooltip>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Total Sources"
                                value={sourceStats.total}
                                prefix={<DatabaseOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Active"
                                value={sourceStats.active}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="HubSpot"
                                value={sourceStats.hubspot}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Google Drive"
                                value={sourceStats.googledrive}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#13c2c2' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Card>
                            <Statistic
                                title="Deleted"
                                value={sourceStats.deleted}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#13c2c2' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </StatisticsContainer>

            <Divider />
            <StatisticsContainer>
                <Typography.Title level={3} style={{ marginBottom: 20 }}>
                    Manager expired status
                </Typography.Title>
                <div
                    style={{
                        padding: '16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 32,
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        minHeight: 90
                    }}
                >
                    <div>
                        <Text strong>Show message expired date</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Enable to show expiration notifications to user
                        </Text>
                    </div>
                    <Switch
                        checked={expiredData?.isExpired || false}
                        onChange={handleExpiredStatusChange}
                        loading={expiredLoading}
                        style={{ marginLeft: 16 }}
                    />
                    <div style={{ minWidth: 220 }}>
                        <Text strong style={{ fontSize: 13 }}>Expired Date</Text>
                        <DatePicker
                            showTime
                            value={expiredData?.expiredDate ? dayjs(expiredData.expiredDate) : null}
                            onChange={handleExpiredDateChange}
                            style={{ width: '100%', marginTop: 4 }}
                            disabled={expiredLoading}
                            disabledDate={(current) => current && current.valueOf() < Date.now()}
                            format="YYYY-MM-DD HH:mm:ss"
                            allowClear={false}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Select a future date and time for the expiration
                        </Text>
                    </div>
                </div>
            </StatisticsContainer>
            <Divider />

            {/* Collapsible Tables */}
            <Collapse defaultActiveKey={['1', '2']} size="large">
                <Panel
                    header={<ConnectionsHeader />}
                    key="1"
                >
                    {filteredConnections.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 0',
                            color: '#666'
                        }}>
                            <Text>No connections found for this filter.</Text>
                        </div>
                    ) : (
                        <>
                            <TableContainer>
                                <Table
                                    columns={connectionColumns}
                                    dataSource={paginatedConnections}
                                    rowKey="_id"
                                    pagination={false}
                                    size="middle"
                                />
                            </TableContainer>

                            <PaginationContainer>
                                <Pagination
                                    current={currentConnectionPage}
                                    pageSize={pageSize}
                                    total={filteredConnections.length} // Use filtered length
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total) => `Total ${total} connections`}
                                    onChange={(page) => setCurrentConnectionPage(page)}
                                    onShowSizeChange={(current, size) => {
                                        setCurrentConnectionPage(1);
                                        setPageSize(size);
                                    }}
                                    pageSizeOptions={['15', '20', '25']}
                                />
                            </PaginationContainer>
                        </>
                    )}
                </Panel>


                <Panel
                    header={<SourcesHeader />}
                    key="2"
                >
                    {filteredSources.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 0',
                            color: '#666'
                        }}>
                            <Text>No sources found for this filter.</Text>
                        </div>
                    ) : (
                        <>
                            <TableContainer>
                                <Table
                                    columns={sourceColumns}
                                    dataSource={paginatedSources}
                                    rowKey="_id"
                                    pagination={false}
                                    size="middle"
                                />
                            </TableContainer>

                            <PaginationContainer>
                                <Pagination
                                    current={currentSourcePage}
                                    pageSize={pageSize}
                                    total={filteredSources.length} // Use filtered length
                                    showSizeChanger
                                    showQuickJumper
                                    showTotal={(total) => `Total ${total} sources`}
                                    onChange={(page) => setCurrentSourcePage(page)}
                                    onShowSizeChange={(current, size) => {
                                        setCurrentSourcePage(1);
                                        setPageSize(size);
                                    }}
                                    pageSizeOptions={['15', '20', '25']}
                                />
                            </PaginationContainer>
                        </>
                    )}
                </Panel>
            </Collapse>

            {/* Connection Detail Modal */}
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
                            <Text strong>{selectedConnection?.name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Connection ID" span={2}>
                            <Text code>{selectedConnection._id}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="From Platform">
                            <Space direction="vertical" size="small">
                                <Text strong>{selectedConnection?.from?.name}</Text>
                                <Text type="secondary">Platform: {selectedConnection?.from?.platform}</Text>
                                <Tag color={selectedConnection?.from?.isActive ? "green" : "red"}>
                                    {selectedConnection?.from?.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Platform">
                            <Space direction="vertical" size="small">
                                <Text strong>{selectedConnection?.to?.name}</Text>
                                <Text type="secondary">Platform: {selectedConnection.to?.platform}</Text>
                                <Tag color={selectedConnection.to.isActive ? "green" : "red"}>
                                    {selectedConnection.to.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="From Credentials">
                            <Space direction="vertical" size="small">
                                {selectedConnection.from?.credentials?.email && (
                                    <Text>Email: {selectedConnection.from?.credentials?.email}</Text>
                                )}
                                {selectedConnection.from?.credentials?.fullName && (
                                    <Text>Full Name: {selectedConnection.from?.credentials?.fullName}</Text>
                                )}
                                {selectedConnection.from?.credentials?.hub_id && (
                                    <Text>Hub ID: {selectedConnection.from?.credentials?.hub_id}</Text>
                                )}
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Credentials">
                            <Space direction="vertical" size="small">
                                {selectedConnection.to?.credentials?.email && (
                                    <Text>Email: {selectedConnection.to?.credentials?.email}</Text>
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
                            <Text>{new Date(selectedConnection?.from?.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="To Created At">
                            <Text>{new Date(selectedConnection.to.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </ResponsiveModal>

            {/* Source Detail Modal */}
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
                            <DatabaseOutlined style={{ fontSize: '16px', color: 'white' }} />
                        </div>
                        <span>Source Details</span>
                    </div>
                }
                open={sourceDetailModalVisible}
                onCancel={() => setSourceDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setSourceDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}
            >
                {selectedSource && (
                    <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="Source Name" span={2}>
                            <Text strong>{selectedSource?.name}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Source ID" span={2}>
                            <Text code>{selectedSource._id}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Platform Type">
                            <Tag color={getPlatformType(selectedSource) === 'HubSpot' ? 'orange' : 'blue'}>
                                {getPlatformType(selectedSource)}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Platform ID">
                            <Text code>{selectedSource?.platform}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            <Text>{selectedSource?.credentials?.email || 'N/A'}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Full Name">
                            <Text>{selectedSource?.credentials?.fullName || 'N/A'}</Text>
                        </Descriptions.Item>

                        {selectedSource?.credentials?.hub_id && (
                            <Descriptions.Item label="Hub ID">
                                <Text>{selectedSource?.credentials?.hub_id}</Text>
                            </Descriptions.Item>
                        )}

                        {selectedSource?.credentials?.token?.folder_id && (
                            <Descriptions.Item label="Folder ID">
                                <Text>{selectedSource?.credentials?.token.folder_id}</Text>
                            </Descriptions.Item>
                        )}

                        <Descriptions.Item label="Token Type">
                            <Text>{selectedSource?.credentials?.token_type || selectedSource?.credentials?.token?.token_type || 'N/A'}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Module Apps">
                            <Text>{selectedSource.ModuleApp.length} modules</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Status">
                            <Space>
                                <Tag color={selectedSource.isActive ? "green" : "red"}
                                    icon={selectedSource.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                                    {selectedSource.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Webhook IDs">
                            <Text>{selectedSource.webhookIds.length} webhooks</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Created At">
                            <Text>{new Date(selectedSource.createdAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Updated At">
                            <Text>{new Date(selectedSource.updatedAt).toLocaleString()}</Text>
                        </Descriptions.Item>

                        {selectedSource.deletedAt && (
                            <Descriptions.Item label="Deleted At" span={2}>
                                <Text type="danger">{new Date(selectedSource.deletedAt).toLocaleString()}</Text>
                            </Descriptions.Item>
                        )}

                        <Descriptions.Item label="Prefix" span={2}>
                            <Text>{selectedSource?.credentials?.prefix || 'N/A'}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </ResponsiveModal>

            {/* Upload Details Modal */}
            <Modal
                title={<div style={{ textAlign: 'center', fontWeight: 600 }}>Upload Details</div>}
                open={uploadModalVisible}
                onCancel={() => setUploadModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setUploadModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={700}
            >
                <Table
                    dataSource={uploadRecords}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No upload records found.' }}
                    columns={[
                        {
                            title: 'Index',
                            key: 'index',
                            width: 70,
                            align: 'center',
                            render: (_: any, __: any, idx: number) => idx + 1,
                        },
                        {
                            title: 'Upload Time',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (date: string) => new Date(date).toLocaleString(),
                        },
                        {
                            title: 'App Name',
                            dataIndex: ['app', 'name'],
                            key: 'name',
                            render: (_: any, record: any) => record.app?.name || '',
                        },
                    ]}
                />
            </Modal>
        </PageContainer>
    );
};

export default StatisticsPage;