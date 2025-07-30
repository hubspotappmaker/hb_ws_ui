'use client';
import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Space, Modal, Typography, Tag, Pagination, message } from 'antd';
import { EyeOutlined, FilterOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getAllLog } from '@/service/user/log';

const { Title } = Typography;
const { Option } = Select;

// Define types
type ShopifyModuleKey = 'customer' | 'product' | 'order';

interface LogRecord {
  _id: string;
  status: boolean;
  connect: string;
  info: Info;
  dataPush: any;
  module: ShopifyModuleKey;
  message: any;
  createdAt: string;
  updatedAt: string;
}

interface Info {
  connectName: string;
  fromName: string;
  toName: string;
}

interface ApiResponse {
  status: number;
  data: {
    data: LogRecord[];
    page: number;
    size: number;
    totalPage: number;
    totalRecord: number;
  };
  msg: string;
}

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
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    .ant-table {
      min-width: 800px;
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
      .ant-pagination-options {
        display: none;
      }
      
      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        display: none;
      }
      
      .ant-pagination-item {
        margin: 0 2px;
        min-width: 28px;
        height: 28px;
        line-height: 26px;
        font-size: 12px;
      }
      
      .ant-pagination-prev,
      .ant-pagination-next {
        min-width: 28px;
        height: 28px;
        line-height: 26px;
      }
      
      .ant-pagination-total-text {
        font-size: 12px;
      }
    }
  }
`;

const StyledTitle = styled(Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 20px !important;
    margin-bottom: 0 !important;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    
    .ant-btn {
      font-size: 12px;
      height: 32px;
      padding: 0 12px;
    }
    
    .ant-select {
      min-width: 120px !important;
      
      .ant-select-selector {
        height: 32px;
        font-size: 12px;
      }
    }
    
    .anticon {
      font-size: 14px;
    }
  }
`;

// Thêm style cho Modal responsive
const MobileModalStyle = styled.div`
  @media (max-width: 768px) {
    .ant-modal {
      margin: 0;
      padding-bottom: 0;
      max-width: calc(100vw - 16px);
    }
    
    .ant-modal-content {
      border-radius: 8px;
    }
    
    .ant-modal-header {
      padding: 16px 16px 12px;
      
      .ant-modal-title {
        font-size: 16px;
      }
    }
    
    .ant-modal-body {
      padding: 16px;
      max-height: 60vh;
      overflow-y: auto;
      
      pre {
        font-size: 11px;
        line-height: 1.4;
        padding: 12px;
        max-height: 300px;
        word-break: break-all;
        white-space: pre-wrap;
      }
    }
    
    .ant-modal-footer {
      padding: 12px 16px 16px;
      text-align: center;
      
      .ant-btn {
        height: 36px;
        font-size: 14px;
        min-width: 80px;
      }
    }
  }
`;

const History: React.FC = () => {
  const [dataSource, setDataSource] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isDataModalVisible, setIsDataModalVisible] = useState(false);
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filters, setFilters] = useState<{
    status?: boolean;
    module?: ShopifyModuleKey;
  }>({});

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try
    {
      const response: any = await getAllLog(
        currentPage,
        pageSize,
        //@ts-ignore
        filters.module,
        filters.status
      );

      if (response.status === 200)
      {
        setDataSource(response.data.data);
        setTotalRecords(response.data.totalRecord);
      } else
      {
        message.error('Failed to fetch log data');
      }
    } catch (error)
    {
      console.error('Error fetching log data:', error);
      message.error('Error fetching log data');
    } finally
    {
      setLoading(false);
    }
  };

  // Load data on component mount and when filters/pagination change
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, filters]);

  const handleViewData = (record: LogRecord) => {
    setSelectedData(record.dataPush);
    setIsDataModalVisible(true);
  };

  const handleViewMessage = (record: LogRecord) => {
    setSelectedMessage(record.message);
    setIsMessageModalVisible(true);
  };

  const handleFilterChange = (value: any, filterType: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRefresh = () => {
    fetchData();
    message.success('Data refreshed successfully');
  };

  const columns = [
    {
      title: 'Index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'From',
      key: 'from',
      render: (record: LogRecord) => record.info?.fromName || 'N/A',
    },
    {
      title: 'To',
      key: 'to',
      render: (record: LogRecord) => record.info?.toName || 'N/A',
    },
    {
      title: 'Connection',
      key: 'connection',
      render: (record: LogRecord) => record.info?.connectName || 'N/A',
    },
    {
      title: 'Data',
      key: 'data',
      render: (record: LogRecord) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewData(record)}
          variant="outlined"
          color="primary"
        >
          View Data
        </Button>
      ),
    },
    {
      title: 'Message',
      key: 'message',
      render: (record: LogRecord) => (
        <Button
          type="default"
          icon={<FileTextOutlined />}
          size="small"
          onClick={() => handleViewMessage(record)}
        >
          View Message
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'SUCCESS' : 'FAILED'}
        </Tag>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      render: (module: string) => (
        <Tag color="#1667ff">
          {module?.toUpperCase() || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];


  return (
    <PageContainer>
      <HeaderContainer>
        <StyledTitle level={2}>History</StyledTitle>
        <FilterContainer>
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <FilterOutlined style={{ color: '#1667ff' }} />
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange(value, 'status')}
            allowClear
            value={filters.status}
          >
            <Option value={true}>Success</Option>
            <Option value={false}>Failed</Option>
          </Select>
          <Select
            placeholder="Filter by Module"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange(value, 'module')}
            allowClear
            value={filters.module}
          >
            <Option value="product">Product</Option>
            <Option value="customer">Customer</Option>
            <Option value="order">Order</Option>
          </Select>
        </FilterContainer>
      </HeaderContainer>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="_id"
          size="middle"
          loading={loading}
        />
      </TableContainer>

      <PaginationContainer>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} records`}
          onChange={(page) => setCurrentPage(page)}
          onShowSizeChange={(current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          }}
          pageSizeOptions={['15', '20', '25']}
        />
      </PaginationContainer>

      {/* Data Modal */}
      <Modal
        title="Record Data"
        open={isDataModalVisible}
        onCancel={() => setIsDataModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDataModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <pre style={{
          background: '#f6f8fa',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {selectedData ? JSON.stringify(selectedData, null, 2) : ''}
        </pre>
      </Modal>

      {/* Message Modal */}
      <Modal
        title="Message Details"
        open={isMessageModalVisible}
        onCancel={() => setIsMessageModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsMessageModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <pre style={{
          background: '#f6f8fa',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {selectedMessage ? JSON.stringify(selectedMessage, null, 2) : ''}
        </pre>
      </Modal>
    </PageContainer>
  );
};

export default History;