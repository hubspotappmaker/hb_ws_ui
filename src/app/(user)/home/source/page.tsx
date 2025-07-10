'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Tag, Modal, Pagination, message, Input } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DownCircleOutlined,
  UpCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectHubspot, getAllSource, softDeleteSource, udpateSource } from '@/service/user/source';

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

// Button container
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-bottom: 16px;
  }
`;

// Main action button
const StyledButton = styled(Button)`
  height: 44px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(22, 103, 255, 0.2);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 103, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    height: 40px;
    padding: 0 24px;
    font-size: 14px;
    width: 100%;
    max-width: 280px;
  }
`;

// Platform selection card in modal
const PlatformCard = styled.div`
  display: flex;
  width: 100%;
  border-radius: 8px;
  background-color: white;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  cursor: pointer;
  
  &:hover {
    border-color: #1667ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

// Icon section of platform card
const PlatformIconSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f6f8ff;
  width: 120px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }
`;

// Content section of platform card
const PlatformContentSection = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 16px;
    text-align: center;
  }
`;

// Platform title with tag
const PlatformTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
`;

// Platform description text
const PlatformDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

// Styled icon wrapper
const StyledIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #1667ff;
  box-shadow: 0 2px 10px rgba(22, 103, 255, 0.15);
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin-right: 30px;
  }
`;

// Type tag styling
const TypeTag = styled(Tag)`
  border-radius: 4px;
  margin-top: 12px;
  padding: 2px 10px;
  
  @media (max-width: 768px) {
    margin-top: 4px;
    font-size: 11px;
  }
`;

// Inline editing container
const EditableNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 4px;
  }
`;

// Name display area (clickable)
const NameDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  flex: 1;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    padding: 2px 4px;
    font-size: 12px;
  }
`;

// Edit input field
const EditInput = styled(Input)`
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// Edit action buttons container
const EditActions = styled.div`
  display: flex;
  gap: 4px;
  
  @media (max-width: 768px) {
    gap: 2px;
  }
`;

// Edit button (shows on hover)
const EditButton = styled(Button)`
  opacity: 0;
  transition: opacity 0.2s;
  
  ${EditableNameContainer}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
    font-size: 11px;
  }
`;

// Responsive Modal wrapper
const ResponsiveModal = styled(Modal)`
  @media (max-width: 768px) {
    .ant-modal {
      max-width: 90% !important;
      margin: 20px auto !important;
    }
    
    .ant-modal-body {
      padding: 16px !important;
      max-height: 60vh !important;
    }
    
    .ant-modal-header {
      padding: 16px 24px !important;
    }
    
    .ant-modal-title {
      font-size: 16px !important;
    }
  }
`;

const sourcePlatforms = [
  {
    name: 'google_drive',
    description: 'Connect your Google Drive to import your files.',
    icon:
      <img
        style={{
          width: 32
        }}
        src="/img/gd-icon.png" alt="Shopify" />
    ,
    type: 'eCommerce',
    logo: '/img/gd-icon.png',
  },
  {
    name: 'HubSpot',
    description: 'Sync your HubSpot CRM products, orders, and customers.',
    icon:
      <img
        style={{
          width: 32
        }}
        src="/img/hubspot.png" alt="Shopify" />
    ,
    type: 'CRM',
    logo: '/hubspot-logo.png',
  },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(isMobile);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const Source = () => {
  const router = useRouter();
  const [sources, setSources] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  // New states for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const isInUsed = searchParams.get('error');
    if (isInUsed === 'used')
    {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');

      router.replace(newUrl.toString(), undefined);

      Modal.info({
        title: 'Error',
        content: 'This HubSpot account has been connected by another account!',
        onOk() {
        },
      });
    }
  }, [searchParams, router]);

  const isMobile = useIsMobile();

  const fetchSources = async () => {
    try
    {
      const response = await getAllSource(currentPage, pageSize);
      console.log('check response on source: ', response);
      const { data: sourcesData, totalRecord } = response.data;
      setSources(sourcesData);
      setTotalRecords(totalRecord);
      console.log('sourcesData:', sourcesData);
    } catch (error)
    {
      console.error('Error fetching sources:', error);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [currentPage, pageSize]);

  const showDeleteConfirm = (sourceId: string) => {
    setSourceToDelete(sourceId);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (sourceToDelete !== null)
    {
      try
      {
        const res = await softDeleteSource(sourceToDelete);
        setDeleteModalVisible(false);
        console.log("check res delete: ", res.status);
        if (res.status == 200)
        {
          fetchSources();
          message.success('Delete success');
        }
        setSourceToDelete(null);
      } catch (error)
      {
        console.error('Error deleting source:', error);
      }
    }
  };

  const handleSelectSource = (sourceName: string) => {
    setModalVisible(false);
    router.push(`/home/create/${sourceName.toLowerCase()}`);
  };

  // New functions for inline editing
  const startEdit = (record: any) => {
    setEditingId(record._id);
    setEditingName(record.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim())
    {
      message.error('Source name cannot be empty');
      return;
    }

    if (editingName.trim() === sources.find(s => s._id === editingId)?.name)
    {
      cancelEdit();
      return;
    }

    setIsUpdating(true);
    try
    {
      const res = await udpateSource({
        id: editingId,
        name: editingName.trim()
      });

      if (res.status === 200)
      {
        message.success('Source name updated successfully');
        fetchSources();
        cancelEdit();
      }
    } catch (error)
    {
      console.error('Error updating source:', error);
      message.error('Failed to update source name');
    } finally
    {
      setIsUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')
    {
      saveEdit();
    } else if (e.key === 'Escape')
    {
      cancelEdit();
    }
  };

  const handleReauthen = async (platform: string, app_id: string) => {
    console.log("click reauth: ", platform)
    if (platform === 'hubspot')
    {

      router.push(`/home/create/hubspot/re-auth/${app_id}`)
    } else if (platform === "google_drive")
    {
      router.push(`/home/create/google_drive/re-auth/${app_id}`)
    } else
    {
      message.info("Cannot support re auth this platform!")
    }
  }

  const EditableName = ({ record }: { record: any }) => {
    const isEditing = editingId === record._id;

    if (isEditing)
    {
      return (
        <EditableNameContainer>
          <EditInput
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={saveEdit}
            autoFocus
            placeholder="Enter source name"
            disabled={isUpdating}
          />
          <EditActions>
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={saveEdit}
              loading={isUpdating}
              style={{ color: '#52c41a' }}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={cancelEdit}
              disabled={isUpdating}
              style={{ color: '#ff4d4f' }}
            />
          </EditActions>
        </EditableNameContainer>
      );
    }

    return (
      <EditableNameContainer>
        <NameDisplay onClick={() => startEdit(record)}>
          <span>{record.name}</span>
        </NameDisplay>
        <EditButton
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => startEdit(record)}
          title="Click to edit"
        />
      </EditableNameContainer>
    );
  };

  const columns = [
    {
      title: 'Index',
      key: 'index',
      //@ts-ignore
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      width: 80,
    },
    {
      title: 'Source Name',
      dataIndex: 'name',
      key: 'name',
      //@ts-ignore
      render: (text, record) => <EditableName record={record} />,
    },
    {
      title: 'Platform',
      dataIndex: ['platform', 'name'],
      key: 'platform',
      render: (name: string) => {
        return name === 'HubSpot' ? 'HubSpot' : 'Google Drive'
      },
    },
    {
      title: 'Type',
      dataIndex: ['platform', 'type'],
      key: 'type',
      render: (type: string) => {
        const normalizedType = type.toLowerCase();
        let color = 'blue';
        if (normalizedType === 'ecommerce') color = 'green';
        if (normalizedType === 'crm') color = 'purple';
        return <Tag color={color}>{normalizedType !== 'ecommerce' ? (type.charAt(0).toUpperCase() + type.slice(1)) : 'Storage'}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? 'green' : 'blue'}
          icon={isActive ? <CheckCircleOutlined /> : <UpCircleOutlined />}
        >
          {isActive ? 'Connected' : 'Ready for synchronization'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      //@ts-ignore
      render: (record) => (
        <>
          <div
            style={{
              gap: 10,
              display: 'flex',
            }}
          >
            <Button
              icon={<RedoOutlined />}
              color="geekblue"
              onClick={() => handleReauthen(record.platform.name, record._id)}
              size="small"
            >
              Re Authen
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record._id)}
              size="small"
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <HeaderContainer>
        <StyledTitle level={2}>Sources</StyledTitle>
      </HeaderContainer>

      <ButtonContainer>
        <StyledButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          size="large"
        >
          Create New Source
        </StyledButton>
      </ButtonContainer>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={sources}
          pagination={false}
          rowKey="_id"
          size="middle"
        />
      </TableContainer>

      <PaginationContainer>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalRecords}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} sources`}
          onChange={(page) => setCurrentPage(page)}
          onShowSizeChange={(current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          }}
          pageSizeOptions={['15', '20', '25']}
        />
      </PaginationContainer>

      {/* Source Selection Modal */}
      <Modal
        title="Select Source Platform"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={isMobile ? '90%' : 700}
        bodyStyle={{
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: isMobile ? '16px' : '24px 24px 8px 24px',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Text type="secondary">
            Select a platform to create a new source connection
          </Typography.Text>
        </div>

        {sourcePlatforms.map((platform, index) => (
          <PlatformCard key={index} onClick={() => handleSelectSource(platform.name)}>
            <PlatformIconSection>
              <StyledIcon>{platform.icon}</StyledIcon>
            </PlatformIconSection>
            <PlatformContentSection>
              <PlatformTitle>
                {platform.name === 'google_drive' ? "Google Drive" : platform.name}
                <TypeTag
                  color={
                    platform.type === 'eCommerce'
                      ? 'green'
                      : platform.type === 'CRM'
                        ? 'purple'
                        : 'cyan'
                  }
                >
                  {platform.type == 'eCommerce' ? 'Storage' : platform.type}
                </TypeTag>
              </PlatformTitle>
              <PlatformDescription>{platform.description}</PlatformDescription>
            </PlatformContentSection>
          </PlatformCard>
        ))}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this source?</p>
      </Modal>
    </PageContainer>
  );
};

export default Source;