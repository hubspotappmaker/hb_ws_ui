'use client';
import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Input, Space, Typography, Tag, Switch, Modal, Pagination, message, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  LinkOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { createConnect, getAllConnect, softDeleteConnect, disableConnect, enableConnect, udpateConnect } from '@/service/user/connect';
import { getAllSource, getAllSourceEcommerce, getAllSourceCrm } from '@/service/user/source';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;


// Styled Components Definitions
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

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 6px !important;
    height: 42px !important;
    padding: 5px 11px !important;
    border: 1px solid #d9d9d9 !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01) !important;
    transition: all 0.3s !important;
    
    &:hover {
      border-color: #1667ff !important;
    }
  }
  
  .ant-select-selection-item {
    line-height: 30px !important;
  }
  
  @media (max-width: 768px) {
    .ant-select-selector {
      height: 40px !important;
    }
    
    .ant-select-selection-item {
      line-height: 28px !important;
    }
  }
`;

const StyledInput = styled(Input)`
  border-radius: 6px !important;
  height: 42px !important;
  padding: 5px 11px !important;
  border: 1px solid #d9d9d9 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01) !important;
  transition: all 0.3s !important;
  
  &:hover, &:focus {
    border-color: #1667ff !important;
  }
  
  @media (max-width: 768px) {
    height: 40px !important;
  }
`;

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
    padding: 0 20px;
    font-size: 14px;
    width: 100%;
    max-width: 250px;
    
    &:hover {
      transform: none;
    }
  }
`;

const ModalLabel = styled.div`
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 8px;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ModalFormGroup = styled.div`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

// New styled components for inline editing
const EditableNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  
  @media (max-width: 768px) {
    gap: 4px;
    min-height: 28px;
  }
`;

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
    gap: 4px;
    font-size: 13px;
  }
`;

const EditInput = styled(Input)`
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 4px;
  
  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const EditButton = styled(Button)`
  opacity: 0;
  transition: opacity 0.2s;
  
  ${EditableNameContainer}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
    font-size: 12px;
    
    .anticon {
      font-size: 12px;
    }
  }
`;

const MobileTableWrapper = styled.div`
  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
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
    
    .ant-switch {
      min-width: 36px;
      height: 18px;
      
      .ant-switch-handle {
        width: 14px;
        height: 14px;
      }
      
      &.ant-switch-checked .ant-switch-handle {
        left: calc(100% - 16px + 2px);
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


// Connect Component
const Connect: React.FC = () => {
  const [connections, setConnections] = useState<any[]>([]);
  const [totalConnections, setTotalConnections] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [connectionName, setConnectionName] = useState<string>('');
  const [sourceId, setSourceId] = useState<any>('');
  const [targetId, setTargetId] = useState<any>('');
  const [ecommerceSources, setEcommerceSources] = useState<any[]>([]);
  const [crmSources, setCrmSources] = useState<any[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<string | null>(null);
  const navigate = useRouter();

  // New states for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      try
      {
        const res = await getAllConnect(currentPage, pageSize);
        console.log("check get all connection: ", res);
        if (res.status === 200)
        {
          setConnections(
            res.data.data.map((conn: any, idx: number) => ({
              ...conn,
              index: (currentPage - 1) * pageSize + idx + 1,
              sourceName: conn.from?.name ?? 'N/A',
              targetName: conn.to?.name ?? 'N/A',
              connectionName: conn.name,
              createdAt: conn.createdAt,
              status: conn.isActive ? 'active' : 'inactive',
              isActive: conn.isActive,
              key: conn._id,
            }))
          );
          setTotalConnections(res.data.totalRecord);
        }
      } catch (error)
      {
        console.error('Failed to fetch connections:', error);
      }
    };
    fetchConnections();
  }, [currentPage, pageSize]);

  // Fetch sources
  useEffect(() => {
    const fetchSources = async () => {
      try
      {
        const ecommerceRes = await getAllSourceEcommerce(1, 1000);
        if (ecommerceRes.status === 200)
        {
          setEcommerceSources(ecommerceRes.data.data);
        }
        const crmRes = await getAllSourceCrm(1, 1000);
        if (crmRes.status === 200)
        {
          setCrmSources(crmRes.data.data);
        }
      } catch (error)
      {
        console.error('Failed to fetch sources:', error);
      }
    };
    fetchSources();
  }, []);

  // New functions for inline editing
  const startEdit = (record: any) => {
    setEditingId(record._id);
    setEditingName(record.connectionName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim())
    {
      message.error('Connection name cannot be empty');
      return;
    }

    if (editingName.trim() === connections.find(c => c._id === editingId)?.connectionName)
    {
      cancelEdit();
      return;
    }

    setIsUpdating(true);
    try
    {
      const res = await udpateConnect({
        id: editingId,
        name: editingName.trim()
      });

      if (res.status === 200)
      {
        message.success('Connection name updated successfully');
        // Update local state
        setConnections(connections.map(conn =>
          conn._id === editingId
            ? { ...conn, connectionName: editingName.trim() }
            : conn
        ));
        cancelEdit();
      }
    } catch (error)
    {
      console.error('Error updating connection:', error);
      message.error('Failed to update connection name');
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

  const EditableConnectionName = ({ record }: { record: any }) => {
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
            placeholder="Enter connection name"
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
          <span>{record.connectionName}</span>
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

  const showCreateModal = () => {
    setConnectionName('');
    setSourceId('');
    setTargetId('');
    setCreateModalVisible(true);
  };

  const handleCreateConnection = async () => {
    if (!connectionName || !sourceId || !targetId)
    {
      Modal.error({
        title: 'Error',
        content: 'Please fill in all required fields',
      });
      return;
    }

    try
    {
      const data = {
        connectName: connectionName,
        from: sourceId,
        to: targetId,
      };
      const res = await createConnect(data);
      if (res.status === 201)
      {
        const connectRes = await getAllConnect(currentPage, pageSize);
        if (connectRes.status === 200)
        {
          setConnections(
            connectRes.data.data.map((conn: any, idx: number) => ({
              ...conn,
              index: (currentPage - 1) * pageSize + idx + 1,
              sourceName: conn.from.name,
              targetName: conn.to.name,
              connectionName: conn.name,
              createdAt: conn.createdAt,
              status: conn.isActive ? 'active' : 'inactive',
              isActive: conn.isActive,
              key: conn._id,
            }))
          );
          setTotalConnections(connectRes.data.totalRecord);
        }
        setCreateModalVisible(false);
        Modal.success({
          title: 'Success',
          content: 'Connection created successfully',
        });
      }
    } catch (error)
    {
      Modal.error({
        title: 'Error',
        content: 'Failed to create connection',
      });
    }
  };

  const showDeleteConfirm = (connectionId: string) => {
    setConnectionToDelete(connectionId);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (connectionToDelete !== null)
    {
      try
      {
        const res = await softDeleteConnect(connectionToDelete);
        if (res.status === 200)
        {
          const connectRes = await getAllConnect(currentPage, pageSize);
          if (connectRes.status === 200)
          {
            setConnections(
              connectRes.data.data.map((conn: any, idx: number) => ({
                ...conn,
                index: (currentPage - 1) * pageSize + idx + 1,
                sourceName: conn.from.name,
                targetName: conn.to.name,
                connectionName: conn.name,
                createdAt: conn.createdAt,
                status: conn.isActive ? 'active' : 'inactive',
                isActive: conn.isActive,
                key: conn._id,
              }))
            );
            setTotalConnections(connectRes.data.totalRecord);
          }
          setDeleteModalVisible(false);
          setConnectionToDelete(null);
          Modal.success({
            title: 'Success',
            content: 'Connection deleted successfully',
          });
        }
      } catch (error)
      {
        Modal.error({
          title: 'Error',
          content: 'Failed to delete connection',
        });
      }
    }
  };

  const handleToggleActive = async (key: string, checked: boolean) => {
    try
    {
      const res = checked ? await enableConnect(key) : await disableConnect(key);
      if (res.status === 200)
      {
        setConnections(
          connections.map((connection) =>
            connection.key === key
              ? { ...connection, isActive: checked, status: checked ? 'active' : 'inactive' }
              : connection
          )
        );
        Modal.success({
          title: 'Success',
          content: `Connection ${checked ? 'activated' : 'deactivated'} successfully`,
        });
      } else
      {
        throw new Error('Failed to update connection status');
      }
    } catch (error)
    {
      console.error('Failed to toggle connection status:', error);
      // Modal.error({
      //   title: 'Error',
      //   content: 'Failed to update connection status',
      // });
    }
  };

  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      width: 80,
    },
    {
      title: 'Connection Name',
      dataIndex: 'connectionName',
      key: 'connectionName',
      //@ts-ignore
      render: (text, record) => <EditableConnectionName record={record} />,
    },
    {
      title: 'From',
      dataIndex: 'sourceName',
      key: 'sourceName',
    },
    {
      title: 'To',
      dataIndex: 'targetName',
      key: 'targetName',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    // {
    //   title: 'Syncing Status',
    //   dataIndex: 'isSyncing',
    //   key: 'isSyncing',
    //   render: (isSyncing: string) => (
    //     <Tag
    //       color={isSyncing ? 'green' : 'red'}
    //       icon={isSyncing ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
    //     >
    //       {isSyncing ? "Sycing" : "Ready For Sync"}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={status === 'active' ? 'green' : 'red'}
          icon={status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip
            color='blue'
            placement="top"
            title={'Enable integration'}
          >
            <Switch
              checked={record.isActive}
              onChange={(checked) => handleToggleActive(record.key, checked)}
            />
          </Tooltip>
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  icon={<SettingOutlined />}*/}
          {/*  onClick={() => {*/}
          {/*    navigate.push(`connect/setting/${record._id}`)*/}
          {/*  }}*/}
          {/*  size="small"*/}
          {/*/>*/}
          <Button
            type="primary"
            disabled={record.isActive || record.isSyncing}
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.key)}
            size="small"
          />
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <HeaderContainer>
        <StyledTitle level={2}>Connect</StyledTitle>
        <StyledButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          size="large"
        >
          Create Connection
        </StyledButton>
      </HeaderContainer>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={connections}
          pagination={false}
          rowKey="key"
          size="middle"
        />
      </TableContainer>

      <PaginationContainer>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalConnections}
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

      {/* Create Connection Modal */}
      <Modal
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
              <LinkOutlined style={{ fontSize: '16px', color: 'white' }} />
            </div>
            <span>Create New Connection</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateConnection}>
            Save
          </Button>,
        ]}
        width={600}
      >
        <div style={{ marginTop: '20px' }}>
          <ModalFormGroup>
            <ModalLabel>
              <LinkOutlined style={{ fontSize: '16px', color: '#1667ff' }} />
              <span>Connection Name</span>
            </ModalLabel>
            <StyledInput
              placeholder="Enter a descriptive name for this connection"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              size="large"
            />
          </ModalFormGroup>

          <ModalFormGroup>
            <ModalLabel>
              <ApiOutlined style={{ fontSize: '16px', color: '#1667ff' }} />
              <span>From</span>
            </ModalLabel>
            <StyledSelect
              placeholder="Select data from"
              style={{ width: '100%' }}
              value={sourceId || undefined}
              onChange={(value) => setSourceId(value)}
              size="large"
            >
              {crmSources.map((source) => (
                <Option key={source._id} value={source._id}>
                  {source.name}
                </Option>
              ))}
            </StyledSelect>
          </ModalFormGroup>

          <ModalFormGroup>
            <ModalLabel>
              <ApiOutlined style={{ fontSize: '16px', color: '#1667ff' }} />
              <span>To</span>
            </ModalLabel>
            <StyledSelect
              placeholder="Select data to"
              style={{ width: '100%' }}
              value={targetId || undefined}
              onChange={(value) => setTargetId(value)}
              size="large"
            >
              {ecommerceSources.map((source) => (
                <Option key={source._id} value={source._id}>
                  {source.name}
                </Option>
              ))}
            </StyledSelect>
          </ModalFormGroup>
        </div>
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
        <p>Are you sure you want to delete this connection?</p>
      </Modal>
    </PageContainer>
  );
};

export default Connect;