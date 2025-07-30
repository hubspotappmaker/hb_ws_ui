'use client'
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Badge,
  Modal,
  Switch,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Alert,
  Spin,
  Input,
  Select,
  message,
  DatePicker,
  Dropdown,
  Tooltip,
  Tag
} from 'antd';
import {
  SyncOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ApiOutlined,
  LeftOutlined,
  CalendarOutlined,
  DownOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';
import { getDetailConnect, startSyncData } from '@/service/user/connect';
import { changeMetafieldStatus, getFieldFrom, getFieldTo, releaseAssociate, associateField } from '@/service/user/field';
import MetafieldSettingsModal from '@/component/metafield/MetafieldSettingsModal';
import SyncLogger from '@/component/setting/sync.logger';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;


const GlobalAntStyles = createGlobalStyle`
  @media (max-width: 576px) {
    .ant-picker-panels {
      width: 300px !important;
    }
  }
`;
// Styled Components for Mobile Responsive
const MobileContainer = styled.div`
  @media (max-width: 768px) {
    padding: 16px !important;
  }
`;

const MobileHeader = styled.div`
  .header-buttons {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    
    .header-buttons {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      
      > * {
        flex: 1;
        min-width: 0;
      }
    }
  }
`;

const MobileMainCard = styled.div`
  @media (max-width: 768px) {
    padding: 20px !important;
    margin: 0 !important;
    border-radius: 8px !important;
  }
`;

const MobileTitleSection = styled.div`
  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px !important;
      line-height: 1.3;
      margin-bottom: 8px !important;
    }
    
    .connection-id {
      font-size: 11px !important;
      word-break: break-all;
      text-align: center;
    }
  }
`;

const MobileSyncStatus = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 20px;
    
    > div {
      padding: 6px 12px !important;
      font-size: 12px !important;
    }
  }
`;

const MobileSyncAllCard = styled.div`
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px !important;
    }
    
    .sync-all-content {
      flex-direction: column !important;
      gap: 16px !important;
      align-items: stretch !important;
    }
    
    .sync-content {
      text-align: center;
      
      h4 {
        font-size: 16px !important;
        margin-bottom: 4px !important;
      }
      
      .sync-description {
        font-size: 12px !important;
      }
    }
    
    .sync-controls {
      flex-direction: column !important;
      gap: 12px !important;
      align-items: stretch !important;
      
      .metafield-control {
        justify-content: center;
        gap: 8px;
        
        span {
          font-size: 12px !important;
        }
      }
      
      .date-range-btn {
        width: 100% !important;
        min-width: auto !important;
      }
      
      .sync-all-btn {
        width: 100% !important;
        min-width: auto !important;
        height: 44px;
      }
    }
  }
`;

const MobileModuleGrid = styled.div`
  @media (max-width: 768px) {
    .ant-row {
      margin: 0 !important;
    }
    
    .ant-col {
      padding: 0 0 16px 0 !important;
    }
  }
`;

const MobileModuleCard = styled.div`
.sync-flow {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 12px !important;
  margin-bottom: 12px !important;
  
  .platform-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 4px !important;
    
    img {
      height: 32px !important;
    }
    
    span {
      font-size: 10px !important;
      font-weight: 500 !important;
    }
  }
  
  .arrow-icon {
    font-size: 16px !important;
    color: #FE7858 !important;
  }
}
  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px !important;
    }
    
    .module-tag {
      margin-bottom: 12px;
      
      .ant-tag {
        font-size: 10px !important;
        padding: 2px 6px;
      }
    }
    
    .module-content {
      .module-icon {
        font-size: 36px !important;
        margin-bottom: 6px !important;
      }
      
      h4 {
        font-size: 16px !important;
        margin: 0 0 4px 0 !important;
      }
      
      .module-description {
        font-size: 11px !important;
        line-height: 1.4;
      }
    }
    
    .ant-divider {
      margin: 12px 0 !important;
    }
    
    .module-buttons {
      .ant-btn {
        height: 40px;
        font-size: 13px !important;
        
        .anticon {
          font-size: 14px;
        }
      }
    }
  }
`;

const MobileDateRangeDropdown = styled.div`
  @media (max-width: 768px) {
    min-width: 280px !important;
    padding: 12px !important;
    
    .ant-picker {
      font-size: 12px !important;
    }
    
    .date-info {
      padding: 6px 8px !important;
      
      .ant-typography {
        font-size: 10px !important;
      }
    }
    
    .date-controls {
      .ant-btn {
        font-size: 11px !important;
        height: 28px;
        padding: 0 8px;
      }
      
      .date-secondary-text {
        font-size: 10px !important;
      }
    }
  }
`;

const MobileModal = styled.div`
  @media (max-width: 768px) {
    .ant-modal {
      margin: 0 !important;
      max-width: 100vw !important;
      top: 0 !important;
      padding-bottom: 0 !important;
    }
    
    .ant-modal-content {
      border-radius: 0 !important;
      height: 100vh;
      overflow-y: auto;
    }
    
    .ant-modal-header {
      padding: 16px !important;
      
      .ant-modal-title {
        font-size: 16px !important;
      }
    }
    
    .ant-modal-body {
      padding: 16px !important;
      max-height: calc(100vh - 110px);
      overflow-y: auto;
    }
    
    .ant-modal-close {
      top: 12px !important;
      right: 12px !important;
    }
  }
`;

const MobileLoadingOverlay = styled.div`
  @media (max-width: 768px) {
    height: 300px !important;
  }
`;

const ModuleCardContent = styled.div`
  .sync-flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
    
    .platform-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      
      img {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }
      
      span {
        font-size: 12px;
        font-weight: 500;
        color: #666;
      }
    }
    
    .arrow-icon {
      font-size: 20px;
      color: #1677ff;
    }
  }
`;

interface Props {
  params: {
    id: string;
  };
}

interface ConnectionData {
  _id: string;
  name: string;
  isActive: boolean;
  user: string;
  from: string;
  to: string;
  createdAt: string;
  updatedAt: string;
  isSyncing: boolean;
  migratedOrders: number;
  migratedContacts: number;
  migratedProducts: number;
  syncMetafield: boolean;
}

type ModuleKey = 'product' | 'customer' | 'order';

const SettingPage: React.FC<Props> = ({ params }) => {
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'ready' | 'syncing'>('ready');
  const [syncAllLoading, setSyncAllLoading] = useState(false);
  const [moduleLoading, setModuleLoading] = useState({
    product: false,
    customer: false,
    order: false
  });
  const [metafieldSettings, setMetafieldSettings] = useState({
    product: { enabled: false, modal: false },
    customer: { enabled: false, modal: false },
    order: { enabled: false, modal: false }
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  // States for SSE data
  const [migratedContacts, setMigratedContacts] = useState(0);
  const [migratedOrders, setMigratedOrders] = useState(0);
  const [migratedProducts, setMigratedProducts] = useState(0);

  // Fetch initial connection data
  useEffect(() => {
    fetchConnectionData();
  }, [params.id, connectionData?.syncMetafield]);

  // Setup SSE connection
  useEffect(() => {
    const eventSource = new EventSource(`https://sync.onextdigital.com/connect-platform-app/sse/connect/${params.id}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('SSE Data:', data);  // In dữ liệu SSE ra console
      setSyncStatus(data.isSyncing ? 'syncing' : 'ready');
      setMigratedContacts(data.migratedContacts);
      setMigratedOrders(data.migratedOrders);
      setMigratedProducts(data.migratedProducts);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, [params.id]);

  const fetchConnectionData = async () => {
    try
    {
      setLoading(true);
      const response: any = await getDetailConnect(params.id);
      if (response.status === 200)
      {

        setConnectionData(response.data);
        setMigratedContacts(response.data.migratedContacts)
        setMigratedOrders(response.data.migratedOrders)
        setMigratedProducts(response.data.migratedProducts)
      }
    } catch (error)
    {
      console.error('Error fetching connection data:', error);
    } finally
    {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncAllLoading(true);
    try
    {
      const body: any = { moduleSync: 'all' };
      if (dateRange[0] && dateRange[1])
      {
        body.sync_from = dateRange[0].format('YYYY-MM-DD');
        body.sync_to = dateRange[1].format('YYYY-MM-DD');
      }
      await startSyncData(params.id, body);
      message.success('All modules synced successfully!');
    } catch (error)
    {
      message.error('Failed to sync all modules');
      console.error('Sync all error:', error);
    } finally
    {
      setSyncAllLoading(false);
      await fetchConnectionData();
    }
  };

  const handleModuleSync = async (module: ModuleKey) => {
    setModuleLoading(prev => ({ ...prev, [module]: true }));
    try
    {
      const body: any = { moduleSync: module };
      if (dateRange[0] && dateRange[1])
      {
        body.sync_from = dateRange[0].format('YYYY-MM-DD');
        body.sync_to = dateRange[1].format('YYYY-MM-DD');
      }
      await startSyncData(params.id, body);
      message.success(`${module.charAt(0).toUpperCase() + module.slice(1)} synced successfully!`);
    } catch (error)
    {
      message.error(`Failed to sync ${module}`);
      console.error(`${module} sync error:`, error);
    } finally
    {
      setModuleLoading(prev => ({ ...prev, [module]: false }));
      await fetchConnectionData();
    }
  };

  const handleMetafieldModal = (module: ModuleKey, open: boolean) => {
    setMetafieldSettings(prev => ({
      ...prev,
      [module]: { ...prev[module], modal: open }
    }));
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1])
    {
      const fromDate = dates[0].format('YYYY-MM-DD');
      const toDate = dates[1].format('YYYY-MM-DD');
      message.success(`Date range selected: ${fromDate} to ${toDate}`);
    }
  };

  const handleClearDateRange = () => {
    setDateRange([null, null]);
    message.info('Date range cleared');
  };

  if (loading)
  {
    return (
      <MobileLoadingOverlay style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </MobileLoadingOverlay>
    );
  }

  const modules: { key: ModuleKey; title: string; icon: JSX.Element; description: string; migrated: number; lastSyncedCount: number; syncFlow: any }[] = [
    {
      key: 'product',
      title: 'Products',
      icon: <ShoppingOutlined />,
      description: 'Sync product information, pricing, and inventory',
      migrated: migratedProducts,
      lastSyncedCount: migratedProducts,
      syncFlow: {
        from: { label: 'Product', target: 'shopify' },
        to: { label: 'Product', target: 'shopify' }
      }
    },
    {
      key: 'customer',
      title: 'Contacts',
      icon: <UserOutlined />,
      description: 'Sync customer profiles and contact information',
      migrated: migratedContacts,
      lastSyncedCount: migratedContacts,
      syncFlow: {
        from: { label: 'Customer', target: 'shopify' },
        to: { label: 'Contact', target: 'shopify' }
      }
    },
    {
      key: 'order',
      title: 'Orders',
      icon: <FileTextOutlined />,
      description: 'Sync order history and transaction data information',
      migrated: migratedOrders,
      lastSyncedCount: migratedOrders,
      syncFlow: {
        from: { label: 'Order', target: 'shopify' },
        to: { label: 'Deal', target: 'shopify' }
      }
    }
  ];

  const dateRangeDropdown = (
    <MobileDateRangeDropdown style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: '400px' }}>
      <div style={{ marginBottom: '12px' }}>
        <Text strong style={{ color: '#1677ff' }}>Select Date Range for Sync</Text>
      </div>
      <RangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
        format="YYYY-MM-DD"
        style={{ width: '100%', marginBottom: '12px' }}
        placeholder={['From Date', 'To Date']}
        allowClear
      />
      {dateRange[0] && dateRange[1] && (
        <div className="date-info" style={{ padding: '8px 12px', backgroundColor: '#f0f8ff', borderRadius: '6px', border: '1px solid #d1ecf1', marginBottom: '12px' }}>
          <Text style={{ fontSize: '12px', color: '#0c5460' }}>
            <CalendarOutlined style={{ marginRight: '6px' }} />
            Selected: {dateRange[0].format('YYYY-MM-DD')} to {dateRange[1].format('YYYY-MM-DD')}
          </Text>
        </div>
      )}
      <div className="date-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button size="small" onClick={handleClearDateRange} disabled={!dateRange[0] && !dateRange[1]}>
          Clear
        </Button>
        <Text type="secondary" className="date-secondary-text" style={{ fontSize: '11px' }}>Leave empty to sync all time</Text>
      </div>
    </MobileDateRangeDropdown>
  );

  return (
    <>
      <GlobalAntStyles />
      <MobileContainer style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <MobileHeader style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div className="header-buttons">
            <Button
              icon={<LeftOutlined />}
              onClick={() => window.history.back()}
              style={{ border: '1px solid rgb(22, 119, 255)', color: 'rgb(22, 119, 255)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}
            >
              Back
            </Button>
            <Tooltip title="Refresh data">
              <Button
                icon={<SyncOutlined />}
                onClick={fetchConnectionData}
                loading={loading}
                style={{ border: '1px solid rgb(22, 119, 255)', color: 'rgb(22, 119, 255)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}
              />
            </Tooltip>
          </div>
        </MobileHeader>

        <MobileMainCard style={{ border: '1px solid #e8e8e8', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', backgroundColor: '#ffffff', padding: '32px', margin: '0 auto', maxWidth: '1200px' }}>
          <MobileTitleSection style={{ marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
              <ApiOutlined style={{ marginRight: '12px' }} />
              {connectionData?.name || 'Connection Settings'}
            </Title>
            <Text type="secondary" className="connection-id">Connection ID: {params.id}</Text>
          </MobileTitleSection>

          <MobileSyncStatus style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', backgroundColor: syncStatus === 'syncing' ? '#e6f7ff' : '#f6ffed', border: `1px solid ${syncStatus === 'syncing' ? '#91d5ff' : '#b7eb8f'}` }}>
              {syncStatus === 'syncing' ? <LoadingOutlined spin style={{ color: '#1677ff' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
              <Text strong style={{ fontSize: '14px' }}>
                {syncStatus === 'syncing' ? 'Syncing in progress...' : 'Sync complete'}
              </Text>
            </div>
          </MobileSyncStatus>

          <MobileSyncAllCard>
            <Card style={{ marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e8e8e8' }}>
              <div className="sync-all-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className="sync-content" style={{ flex: 1, minWidth: '250px' }}>
                  <Title level={4} style={{ margin: 0 }}>Sync All Modules</Title>
                  <Text type="secondary" className="sync-description">Synchronize all products, customers, and orders at once</Text>
                </div>
                <div className="sync-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div className="metafield-control" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text>Enable Sync Metafield:</Text>
                    <Switch
                      disabled={connectionData?.isSyncing || syncStatus === 'syncing' || syncAllLoading}
                      checked={connectionData?.syncMetafield}
                      onChange={async (checked) => {
                        try
                        {
                          await changeMetafieldStatus(connectionData!._id);
                          setConnectionData(prev => prev ? { ...prev, syncMetafield: checked } : prev);
                          message.success(`Metafield sync ${checked ? 'enabled' : 'disabled'} for all modules`);
                        } catch (err)
                        {
                          message.error('Failed to update metafield status');
                          console.error(err);
                        }
                      }}
                    />
                  </div>
                  <Dropdown
                    overlay={dateRangeDropdown}
                    trigger={['click']}
                    open={dateRangeOpen}
                    onOpenChange={setDateRangeOpen}
                    placement="bottomRight"
                    disabled={syncStatus === 'syncing' || syncAllLoading}
                  >
                    <Button
                      className="date-range-btn"
                      icon={<CalendarOutlined />}
                      style={{
                        borderColor: '#1677ff',
                        color: dateRange[0] && dateRange[1] ? '#fff' : '#1677ff',
                        backgroundColor: dateRange[0] && dateRange[1] ? '#1677ff' : '#fff',
                        fontWeight: dateRange[0] && dateRange[1] ? 'bold' : 'normal',
                        minWidth: '140px'
                      }}
                    >
                      {dateRange[0] && dateRange[1] ? `${dateRange[0].format('MM/DD')} - ${dateRange[1].format('MM/DD')}` : 'Date Range'}
                      <DownOutlined style={{ marginLeft: '6px', fontSize: '10px' }} />
                    </Button>
                  </Dropdown>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SyncOutlined />}
                    loading={syncAllLoading}
                    disabled={syncStatus === 'syncing'}
                    onClick={handleSyncAll}
                    className="sync-all-btn"
                    style={{ backgroundColor: '#1677ff', borderColor: '#1677ff', minWidth: '120px', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)' }}
                  >
                    {syncAllLoading ? 'Syncing...' : 'Sync All'}
                  </Button>
                </div>
              </div>
            </Card>
          </MobileSyncAllCard>

          <MobileModuleGrid>
            <Row gutter={[16, 16]}>
              {modules.map((module) => (
                <Col xs={24} lg={8} key={module.key}>
                  <MobileModuleCard>
                    <Card style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e8e8e8', transition: 'all 0.3s ease' }} hoverable>
                      <div className="module-tag">
                        <Tag color="processing">
                          {syncStatus === 'syncing'
                            ? `Synced: ${module.migrated} records`
                            : `Last Synced: ${module.lastSyncedCount} records`}
                        </Tag>
                      </div>
                      <div className="module-content" style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <Divider />
                        <div className="module-icon" style={{ fontSize: '48px', color: '#1677ff', marginBottom: '8px' }}>{module.icon}</div>
                        <Title level={4} style={{ margin: 0 }}>{module.title}</Title>
                        <div className="sync-flow">
                          <div className="platform-item">
                            <img src="/img/shopify.png" alt="Shopify" />
                          </div>
                          <div className="platform-item">
                            <svg width="40px" height="32px" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M6 12H22M22 12L17 7M22 12L17 17"
                                stroke="#1677ff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="platform-item">
                            <img src="/img/hubspot.png" alt="Target Platform" />
                          </div>
                        </div>

                        <Text type="secondary" className="module-description" style={{ fontSize: '12px' }}>{module.description}</Text>
                      </div>
                      <Divider />
                      <Space direction="vertical" className="module-buttons" style={{ width: '100%' }} size="middle">
                        <Button
                          type="primary"
                          block
                          icon={<SyncOutlined />}
                          loading={moduleLoading[module.key]}
                          disabled={syncAllLoading || syncStatus === 'syncing'}
                          onClick={() => handleModuleSync(module.key)}
                          style={{ borderColor: '#1677ff', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)' }}
                        >
                          {moduleLoading[module.key] ? 'Syncing...' : `Sync ${module.title}`}
                        </Button>
                        <Button
                          block
                          icon={<SettingOutlined />}
                          onClick={() => handleMetafieldModal(module.key, true)}
                          disabled={!connectionData?.syncMetafield || syncAllLoading || syncStatus === 'syncing'}
                          style={{ borderColor: '#1677ff', color: '#1677ff' }}
                        >
                          Metafield Settings
                        </Button>
                      </Space>
                    </Card>
                  </MobileModuleCard>
                </Col>
              ))}
            </Row>
          </MobileModuleGrid>

          {modules.map((module) => (
            <MobileModal key={`modal-${module.key}`}>
              <Modal
                title={`${module.title} Metafield Settings`}
                open={metafieldSettings[module.key].modal}
                onCancel={() => handleMetafieldModal(module.key, false)}
                footer={
                  <Button
                    color='primary'
                    onClick={() => handleMetafieldModal(module.key, false)}
                  >
                    Save
                  </Button>
                }
                width={800}
              >
                <MetafieldSettingsModal
                  connect_id={params.id}
                  module={module.key.toUpperCase() as 'PRODUCT' | 'CUSTOMER' | 'ORDER'}
                />
              </Modal>
            </MobileModal>
          ))}

          <SyncLogger
            connectionId={params.id}
            migratedProducts={migratedProducts}
            migratedContacts={migratedContacts}
            migratedOrders={migratedOrders}
            isSyncing={syncStatus === 'syncing'}
            lastSyncedCounts={{
              product: connectionData?.migratedProducts || 0,
              customer: connectionData?.migratedContacts || 0,
              order: connectionData?.migratedOrders || 0,
            }}
          />

          <Alert
            style={{
              marginTop: 20
            }}
            message="Informational Notes"
            description="Data synchronization is running in the background, feel free to close this tab and check back later."
            type="info"
            showIcon
          />
        </MobileMainCard>
      </MobileContainer>
    </>
  );
};

export default SettingPage;