'use client';
import { Table, Select, Button, message, Spin, Modal, Form, Input, Space, Card, Empty } from 'antd';
import { PlusOutlined, DisconnectOutlined, SaveOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import { getFieldFrom, getFieldTo, associateField, releaseAssociate, createNewCustomHubspotField } from '@/service/user/field';
import { ShopifyModuleKey } from '@/lib/constant/shopify.constant';

interface Field {
    _id: string;
    name: string;
    label: string;
    mappingField?: string | null;
    associatedTo?: string | null;
    [key: string]: any;
}

interface MetafieldSettingsModalProps {
    connect_id: string;
    module: ShopifyModuleKey;
}

const MetafieldSettingsModal = ({ connect_id, module }: MetafieldSettingsModalProps) => {
    const [fromFields, setFromFields] = useState<Field[]>([]);
    const [toFields, setToFields] = useState<Field[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [creatingFor, setCreatingFor] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [isCreating, setIsCreating] = useState(false);
    const [associating, setAssociating] = useState<string | null>(null);
    const [disassociating, setDisassociating] = useState<string | null>(null);

    // Add isUsed status to toFields
    const processedToFields = useMemo(() => {
        const usedIds = fromFields
            .map(f => f.associatedTo)
            .filter((id): id is string => Boolean(id));
        return toFields.map(f => ({
            ...f,
            isUsed: usedIds.includes(f._id),
        }));
    }, [toFields, fromFields]);

    // Helper to map raw API fields
    const transformFrom = (fields: Field[]): Field[] =>
        fields.map(f => ({ ...f, associatedTo: f.mappingField || null }));

    // Refresh all data from API
    const refreshData = async (isInitial = false) => {
        if (isInitial)
        {
            setInitialLoading(true);
        } else
        {
            setRefreshing(true);
        }

        try
        {
            const [fromResponse, toResponse] = await Promise.all([
                getFieldFrom(connect_id, module),
                getFieldTo(connect_id, module)
            ]);

            if (fromResponse.status === 200)
            {
                setFromFields(transformFrom(fromResponse.data));
            } else
            {
                message.error('Failed to load from fields');
            }

            if (toResponse.status === 200)
            {
                setToFields(toResponse.data);
            } else
            {
                message.error('Failed to load to fields');
            }
        } catch (error)
        {
            message.error('Error fetching metafield data');
        } finally
        {
            if (isInitial)
            {
                setInitialLoading(false);
            } else
            {
                setRefreshing(false);
            }
        }
    };

    // Fetch initial data
    useEffect(() => {
        refreshData(true);
    }, [connect_id, module]);

    // Handle field association with prevention for create_new
    const handleAssociate = async (fromId: string, toId: string) => {
        // Prevent association if trying to associate with create_new option
        if (toId === 'create_new')
        {
            return;
        }

        setAssociating(fromId);
        try
        {
            await associateField({ connect: connect_id, from: fromId, to: toId });
            message.success('Fields associated successfully');
            await refreshData(); // Reload all data
        } catch (error)
        {
            message.error('Failed to associate fields');
        } finally
        {
            setAssociating(null);
        }
    };

    // Handle field disassociation
    const handleDisassociate = async (fromId: string) => {
        setDisassociating(fromId);
        try
        {
            await releaseAssociate(fromId);
            message.success('Field disassociated successfully');
            await refreshData(); // Reload all data
        } catch (error)
        {
            message.error('Failed to disassociate field');
        } finally
        {
            setDisassociating(null);
        }
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalVisible(false);
        setCreatingFor(null);
        form.resetFields();
        setIsCreating(false);
    };

    // Handle form submission
    const handleFormSubmit = async (values: { name: string }) => {
        const name = values.name.trim();
        setIsCreating(true);

        try
        {
            const response = await createNewCustomHubspotField({
                module,
                name,
                connect_id,
            });

            if (response.status === 201)
            {
                message.success('New field created and associated successfully');
                handleModalClose();
                await refreshData();
            } else
            {
                message.error('Failed to create new field');
            }
        } catch (error)
        {
            message.error('Error creating new field');
        } finally
        {
            setIsCreating(false);
        }
    };

    // Loading state for initial load
    if (initialLoading)
    {
        return (
            <Card>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '300px',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <Spin size="large" />
                    <span style={{ color: '#666', fontSize: '14px' }}>Loading field mappings...</span>
                </div>
            </Card>
        );
    }

    // Empty state
    if (!fromFields.length)
    {
        return (
            <Card>
                <Empty
                    description="No metafields found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => refreshData()}
                        loading={refreshing}
                    >
                        Refresh
                    </Button>
                </Empty>
            </Card>
        );
    }

    // Table columns
    const columns = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Shopify Meta Field
                    <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        loading={refreshing}
                        onClick={() => refreshData()}
                        title="Refresh data"
                    />
                </div>
            ),
            dataIndex: 'label',
            key: 'label',
            width: '40%',
        },
        {
            title: 'Associated Field',
            width: '40%',
            render: (_: any, record: Field) => {
                const options = processedToFields.filter(f =>
                    !f.isUsed || f._id === record.associatedTo
                );
                const isLoading = associating === record._id;

                return (
                    <Select
                        value={record.associatedTo || undefined}
                        onChange={(value) => {
                            if (value === 'create_new')
                            {
                                setCreatingFor(record._id);
                                setIsModalVisible(true);
                            } else if (value !== 'create_new')
                            {
                                handleAssociate(record._id, value);
                            }
                        }}
                        placeholder="Select to associate"
                        style={{ width: '100%' }}
                        allowClear={false}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        <Select.Option key="create_new" value="create_new">
                            <Space>
                                <PlusOutlined style={{ color: '#1890ff' }} />
                                Create New Field
                            </Space>
                        </Select.Option>
                        {options.map(field => (
                            <Select.Option key={field._id} value={field._id}>
                                {field.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            },
        },
        {
            title: 'Action',
            width: '20%',
            render: (_: any, record: Field) => {
                const isLoading = disassociating === record._id;

                return (
                    <Button
                        icon={<DisconnectOutlined />}
                        onClick={() => handleDisassociate(record._id)}
                        disabled={!record.associatedTo || isLoading}
                        type="default"
                        danger
                        size="small"
                        loading={isLoading}
                    >
                        {isLoading ? 'Removing...' : 'Disassociate'}
                    </Button>
                );
            }
        },
    ];

    return (
        <div>
            <Card>
                <Table
                    dataSource={fromFields}
                    columns={columns}
                    rowKey="_id"
                    bordered
                    size="middle"
                    pagination={false}
                    scroll={{ y: 400 }}
                    loading={refreshing}
                />
            </Card>

            {/* Enhanced Modal for creating new field */}
            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: '#1890ff' }} />
                        Create New HubSpot Field
                    </Space>
                }
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={500}
                centered
                maskClosable={!isCreating}
                destroyOnClose
            >
                <div style={{ padding: '20px 0' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label={
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                                    Field Name
                                </span>
                            }
                            rules={[
                                { required: true, message: 'Please enter a field name' },
                                { min: 6, message: 'Name must be at least 6 characters' },
                                { max: 50, message: 'Name must not exceed 50 characters' },
                                {
                                    pattern: /^[a-zA-Z0-9_\s]+$/,
                                    message: 'Only letters, numbers, underscores and spaces allowed'
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter a descriptive field name (min 6 characters)"
                                style={{ height: '40px' }}
                                showCount
                                maxLength={50}
                                disabled={isCreating}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleModalClose}
                                    disabled={isCreating}
                                    size="large"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={isCreating}
                                    size="large"
                                >
                                    {isCreating ? 'Creating...' : 'Create & Associate'}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default MetafieldSettingsModal;