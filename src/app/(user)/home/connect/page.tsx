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
import { createConnect, getAllConnect, softDeleteConnect, disableConnect, enableConnect, udpateConnect, changeConnectSource } from '@/service/user/connect';
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
    display: none; // Ẩn table trên mobile
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
      
      .ant-pagination-item, 
      .ant-pagination-prev, 
      .ant-pagination-next {
        margin: 2px;
      }
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

// Mobile Card Components
const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    gap: 16px;
  }
`;

const ConnectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  &:hover, &:active {
    box-shadow: 0 4px 16px rgba(22,103,255,0.18);
    transform: translateY(-2px) scale(1.01);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 8px;
  position: relative;
`;

const CardTitle = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardConnectionName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IndexBadge = styled.div`
  background-color: #1667ff;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(22,103,255,0.12);
`;

const CardStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-width: 70px;
`;

const CardBody = styled.div`
  margin-bottom: 16px;
`;

const ConnectionFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const SourceBox = styled.div`
  width: 100%;
  position: relative;
`;

const SourceLabel = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SourceName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  padding: 10px 14px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6f4ff;
  word-break: break-word;
  line-height: 1.4;
  min-height: 40px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FlowArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1667ff;
  font-size: 18px;
  margin: 4px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 8px;
    background: #e6f4ff;
    top: -10px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 8px;
    background: #e6f4ff;
    bottom: -10px;
  }
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #8c8c8c;
  gap: 8px;
`;

const CardDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const MobileActionButton = styled(Button)`
  padding: 6px 12px;
  height: auto;
  font-size: 12px;
  border-radius: 6px;
  .anticon { font-size: 14px; }
`;

const MobileEditSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 6px !important;
    min-height: 36px !important;
    padding: 6px 11px !important;
    border: 1px solid #d9d9d9 !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.01) !important;
    transition: all 0.3s !important;
    
    &:hover {
      border-color: #1667ff !important;
    }
  }
  
  .ant-select-selection-item {
    line-height: 24px !important;
    font-size: 14px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .ant-select-selection-placeholder {
    line-height: 24px !important;
    font-size: 14px !important;
  }
`;

const MobileSwitch = styled(Switch)`
  min-width: 44px;
  height: 22px;
  .ant-switch-handle { width: 18px; height: 18px; top: 2px; }
  &.ant-switch-checked .ant-switch-handle { left: calc(100% - 20px); }
`;

// Styled components for inline editing
const EditableNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 6px;
    min-height: 40px;
    flex-wrap: nowrap;
  }
`;

const NameDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  flex: 1;
  min-width: 0;
  word-break: break-word;
  line-height: 1.4;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 6px;
    font-size: 14px;
    min-height: 36px;
    
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
`;

const EditInput = styled(Input)`
  flex: 1;
  min-width: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
    height: 36px;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const EditButton = styled(Button)`
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;

  ${EditableNameContainer}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
    font-size: 12px;
    width: 28px;
    height: 28px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .anticon {
      font-size: 12px;
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
      margin: 16px auto;
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
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }
    
    .ant-modal-footer {
      padding: 12px 20px;
      
      .ant-btn {
        height: 36px;
        font-size: 14px;
        flex: 1;
        margin: 0 4px;
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

  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [editingFromId, setEditingFromId] = useState<string>('');
  const [editingToId, setEditingToId] = useState<string>('');
  const [isUpdatingSource, setIsUpdatingSource] = useState(false);

  // New states for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const startEditSource = (record: any, type: 'from' | 'to') => {
    setEditingSourceId(record._id);
    if (type === 'from')
    {
      setEditingFromId(record.from?._id || '');
    } else
    {
      setEditingToId(record.to?._id || '');
    }
  };

  const cancelEditSource = () => {
    setEditingSourceId(null);
    setEditingFromId('');
    setEditingToId('');
  };

  const saveEditSource = async () => {
    if (!editingSourceId) return;

    const currentConnection = connections.find(c => c._id === editingSourceId);
    if (!currentConnection) return;

    const newFromId = editingFromId || currentConnection.from?._id;
    const newToId = editingToId || currentConnection.to?._id;

    if (!newFromId || !newToId)
    {
      message.error('Both From and To sources must be selected');
      return;
    }

    // Check if there are any changes
    if (newFromId === currentConnection.from?._id && newToId === currentConnection.to?._id)
    {
      cancelEditSource();
      return;
    }

    setIsUpdatingSource(true);
    try
    {
      const res = await changeConnectSource(editingSourceId, newFromId, newToId);

      if (res.status === 200)
      {
        message.success('Connection sources updated successfully');

        // Refresh connections list
        const connectRes = await getAllConnect(currentPage, pageSize);
        if (connectRes.status === 200)
        {
          setConnections(
            connectRes.data.data.map((conn: any, idx: number) => ({
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
          setTotalConnections(connectRes.data.totalRecord);
        }
        cancelEditSource();
      }
    } catch (error)
    {
      console.error('Error updating connection sources:', error);
      message.error('Failed to update connection sources');
    } finally
    {
      setIsUpdatingSource(false);
    }
  };

  const EditableSource = ({ record, type }: { record: any; type: 'from' | 'to' }) => {
    const isEditing = editingSourceId === record._id;
    const currentValue = type === 'from' ? record.sourceName : record.targetName;
    const sources = type === 'from' ? crmSources : ecommerceSources;
    const selectedValue = type === 'from' ? editingFromId : editingToId;
    const onChange = type === 'from' ? setEditingFromId : setEditingToId;

    if (isEditing)
    {
      return (
        <EditableNameContainer>
          <MobileEditSelect
            value={selectedValue || undefined}
            //@ts-ignore
            onChange={onChange}
            placeholder={`Select ${type === 'from' ? 'source' : 'target'}`}
            style={{ flex: 1, minWidth: 0 }}
            size="small"
            disabled={isUpdatingSource}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                ?.includes(input.toLowerCase()) ?? false
            }
          >
            {sources.map((source) => (
              <Option key={source._id} value={source._id}>
                {source.name}
              </Option>
            ))}
          </MobileEditSelect>
          <EditActions>
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={saveEditSource}
              loading={isUpdatingSource}
              style={{ color: '#52c41a', width: '28px', height: '28px' }}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={cancelEditSource}
              disabled={isUpdatingSource}
              style={{ color: '#ff4d4f', width: '28px', height: '28px' }}
            />
          </EditActions>
        </EditableNameContainer>
      );
    }

    return (
      <EditableNameContainer>
        <NameDisplay onClick={() => startEditSource(record, type)}>
          <span title={currentValue}>{currentValue}</span>
        </NameDisplay>
        <EditButton
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => startEditSource(record, type)}
          title="Click to change source"
        />
      </EditableNameContainer>
    );
  };

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
              // Lưu thêm object đầy đủ để có thể access _id
              from: conn.from,
              to: conn.to,
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

  // Mobile Connection Card Component
  const MobileConnectionCard: React.FC<{ record: any }> = ({ record }) => {
    return (
      <ConnectionCard>
        <CardHeader>
          <IndexBadge>{record.index}</IndexBadge>
          <CardTitle>
            <CardConnectionName>
              <EditableConnectionName record={record} />
            </CardConnectionName>
          </CardTitle>
          <CardStatus>
            <Tag
              color={record.status === 'active' ? 'green' : 'red'}
              icon={record.status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              style={{ margin: 0, fontSize: '11px', minWidth: 60, textAlign: 'center' }}
            >
              {record.status.toUpperCase()}
            </Tag>
          </CardStatus>
        </CardHeader>
        <CardBody>
          <ConnectionFlow>
            <SourceBox>
              <SourceLabel>
                <ApiOutlined style={{ fontSize: '12px' }} />
                From Source
              </SourceLabel>
              <SourceName>
                <EditableSource record={record} type="from" />
              </SourceName>
            </SourceBox>
            <FlowArrow>
              <div style={{
                background: '#1667ff',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700
              }}>
                ↓
              </div>
            </FlowArrow>
            <SourceBox>
              <SourceLabel>
                <ApiOutlined style={{ fontSize: '12px' }} />
                To Destination
              </SourceLabel>
              <SourceName>
                <EditableSource record={record} type="to" />
              </SourceName>
            </SourceBox>
          </ConnectionFlow>
        </CardBody>
        <CardMeta>
          <CardDate>
            <span>Created: {new Date(record.createdAt).toLocaleDateString()}</span>
          </CardDate>
          <CardActions>
            <Tooltip title="Enable/Disable integration" placement="top">
              <MobileSwitch
                checked={record.isActive}
                onChange={(checked) => handleToggleActive(record.key, checked)}
                size="small"
              />
            </Tooltip>
            <Tooltip title={record.isActive ? 'Disable before delete' : 'Delete connection'} placement="top">
              <MobileActionButton
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record.key)}
                disabled={record.isActive || record.isSyncing}
              >
                Delete
              </MobileActionButton>
            </Tooltip>
          </CardActions>
        </CardMeta>
      </ConnectionCard>
    );
  };

  // Mobile Connection List Component
  const MobileConnectionList: React.FC<{
    connections: any[],
    handleToggleActive: (key: string, checked: boolean) => void,
    showDeleteConfirm: (key: string) => void
  }> = ({ connections, handleToggleActive, showDeleteConfirm }) => {
    return (
      <MobileCardContainer>
        {connections.map((connection) => (
          <MobileConnectionCard
            key={connection.key}
            record={connection}
          />
        ))}
      </MobileCardContainer>
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
      //@ts-ignore
      render: (text, record) => <EditableSource record={record} type="from" />,
    },
    {
      title: 'To',
      dataIndex: 'targetName',
      key: 'targetName',
      //@ts-ignore
      render: (text, record) => <EditableSource record={record} type="to" />,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
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
        <ActionButtonGroup>
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
          <Button
            type="primary"
            disabled={record.isActive || record.isSyncing}
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.key)}
            size="small"
          />
        </ActionButtonGroup>
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

      {/* Desktop Table */}
      <TableContainer>
        <Table
          columns={columns}
          dataSource={connections}
          pagination={false}
          rowKey="key"
          size="middle"
        />
      </TableContainer>

      {/* Mobile Card Layout */}
      <MobileConnectionList
        connections={connections}
        handleToggleActive={handleToggleActive}
        showDeleteConfirm={showDeleteConfirm}
      />

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
      </ResponsiveModal>

      {/* Delete Confirmation Modal */}
      <ResponsiveModal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this connection?</p>
      </ResponsiveModal>
    </PageContainer>
  );
};

export default Connect;