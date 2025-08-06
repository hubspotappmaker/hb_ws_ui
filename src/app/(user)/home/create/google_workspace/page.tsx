'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Upload,
    Button,
    Input,
    notification,
    Typography,
    Card,
    Space,
    Alert,
    Divider,
    message,
    Row,
    Col,
    Spin
} from 'antd';
import {
    UploadOutlined,
    CopyOutlined,
    FileTextOutlined,
    CloudUploadOutlined,
    HddOutlined,
    FolderOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Drive {
    kind: string;
    id: string;
    name: string;
}

interface DriveListResponse {
    drives: Drive[];
    kind: string;
}

export default function TokenPage() {
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [drives, setDrives] = useState<Drive[]>([]);
    const [fetchingDrives, setFetchingDrives] = useState<boolean>(false);
    const [selectedDrive, setSelectedDrive] = useState<Drive | null>(null);
    const router = useRouter();

    const fetchDrives = async (accessToken: string) => {
        setFetchingDrives(true);
        try
        {
            const response = await axios.get('https://www.googleapis.com/drive/v3/drives', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            const data: DriveListResponse = response.data;
            setDrives(data.drives || []);

            if (data.drives && data.drives.length > 0)
            {
                notification.success({
                    message: 'Drives Fetched Successfully',
                    description: `Found ${data.drives.length} shared drive(s)`,
                    duration: 3,
                });
            } else
            {
                notification.warning({
                    message: 'No Shared Drives Found',
                    description: 'You don\'t have access to any shared drives. You can still use your personal drive.',
                    duration: 5,
                });
            }
        } catch (err: any)
        {
            console.error('Error fetching drives:', err);
            notification.error({
                message: 'Failed to Fetch Drives',
                description: err.response?.data?.error?.message || err.message || 'An error occurred while fetching drives',
                duration: 6,
            });
        } finally
        {
            setFetchingDrives(false);
        }
    };

    const handleFile = async (file: File) => {
        setLoading(true);
        try
        {
            const text = await file.text();
            const json = JSON.parse(text);

            const response = await axios.post('/api/token', json);
            const data = response.data;

            setToken(data.token);
            console.log('Generated token:', data.token);

            if (data.token)
            {
                // Fetch drives after getting token
                await fetchDrives(data.token);
            }

            notification.success({
                message: 'Token Generated Successfully',
                description: 'Your Google Drive access token has been created and is ready to use.',
                duration: 4.5,
            });
        } catch (err: any)
        {
            console.error('Token generation error:', err);
            notification.error({
                message: 'Token Generation Failed',
                description: err.response?.data?.error || err.message || 'An unexpected error occurred',
                duration: 6,
            });
        } finally
        {
            setLoading(false);
        }

        return false; // Prevent default upload
    };

    const handleDriveSelect = (drive: Drive) => {
        setSelectedDrive(drive);
        notification.success({
            message: 'Drive Selected',
            description: `Selected: ${drive.name}`,
            duration: 2,
        });
    };

    const handleContinue = () => {
        if (selectedDrive)
        {
            router.push(`/home/root?iframe=https://gdrive.nexce.io/fe/driverootpicker?access_token=${token}&driveId=${selectedDrive.id}`);
        }
    };

    const copyToClipboard = async () => {
        try
        {
            await navigator.clipboard.writeText(token);
            message.success('Token copied to clipboard!');
        } catch (err)
        {
            message.error('Failed to copy token');
        }
    };

    return (
        <div style={{
            maxWidth: 1000,
            margin: '2rem auto',
            padding: '0 1rem'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <CloudUploadOutlined style={{ fontSize: '3rem', color: '#1890ff', marginBottom: '1rem' }} />
                <Title level={2} style={{ marginBottom: '0.5rem' }}>
                    Google Drive Token Generator
                </Title>
                <Paragraph type="secondary" style={{ fontSize: '16px' }}>
                    Upload your service account JSON file to generate an access token for Google Drive API
                </Paragraph>
            </div>

            <Alert
                message="Setup Required"
                description={
                    <span>
                        <Text>
                            See the instructions{' '}
                            <a
                                href="https://nexce.io/guides/how-to-get-services-json-file"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontWeight: 500 }}
                            >
                                here
                            </a>
                            {' '}to Create Service Account JSON and Enable Google Drive API.
                        </Text>
                    </span>
                }
                type="info"
                showIcon
                style={{ marginBottom: '2rem' }}
            />

            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        <span>Upload Service Account JSON</span>
                    </Space>
                }
                style={{ marginBottom: '1.5rem' }}
            >
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <Upload
                        accept="application/json,.json"
                        beforeUpload={handleFile}
                        showUploadList={false}
                        disabled={loading}
                        style={{ display: 'block' }}
                    >
                        <Button
                            icon={<UploadOutlined />}
                            loading={loading}
                            size="large"
                            type="primary"
                            style={{
                                height: '48px',
                                minWidth: '200px',
                                fontSize: '16px'
                            }}
                        >
                            {loading ? 'Processing...' : 'Select JSON File'}
                        </Button>
                    </Upload>
                    <Text type="secondary" style={{ marginTop: '1rem', display: 'block' }}>
                        Only JSON files are accepted
                    </Text>
                </div>
            </Card>

            {/* Drive Selection Section */}
            {token && (
                <Card
                    title={
                        <Space>
                            <HddOutlined />
                            <span>Select Google Team Drive</span>
                        </Space>
                    }
                    style={{ marginBottom: '1.5rem' }}
                >
                    {fetchingDrives ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: '1rem' }}>
                                <Text>Fetching your shared drives...</Text>
                            </div>
                        </div>
                    ) : drives.length > 0 ? (
                        <>
                            <Alert
                                message="Shared Drives Found"
                                description="Select a shared drive to continue"
                                type="success"
                                showIcon
                                style={{ marginBottom: '1.5rem' }}
                            />

                            <Row gutter={[16, 16]}>
                                {drives.map((drive) => (
                                    <Col xs={24} sm={12} md={8} key={drive.id}>
                                        <Card
                                            hoverable
                                            style={{
                                                cursor: 'pointer',
                                                border: selectedDrive?.id === drive.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                                backgroundColor: selectedDrive?.id === drive.id ? '#f0f8ff' : 'white',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => handleDriveSelect(drive)}
                                        >
                                            <div style={{ textAlign: 'center' }}>
                                                <DatabaseOutlined
                                                    style={{
                                                        fontSize: '2.5rem',
                                                        color: selectedDrive?.id === drive.id ? '#1890ff' : '#52c41a',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                />
                                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '0.5rem' }}>
                                                    {drive.name}
                                                </div>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    ID: {drive.id}
                                                </Text>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <Space>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleContinue}
                                        disabled={!selectedDrive}
                                        icon={<FolderOutlined />}
                                    >
                                        Continue with Team Drive
                                    </Button>
                                </Space>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <HddOutlined style={{ fontSize: '3rem', color: '#52c41a', marginBottom: '1rem' }} />
                            <div style={{ marginBottom: '1rem' }}>
                                <Text strong style={{ fontSize: '16px' }}>
                                    No Shared Drives Found
                                </Text>
                            </div>
                            <Text type="secondary">
                                You can continue with your personal Google Drive
                            </Text>
                            <div style={{ marginTop: '1.5rem' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => router.push(`/home/root?iframe=https://gdrive.nexce.io/fe/driverootpicker?access_token=${token}`)}
                                    icon={<HddOutlined />}
                                >
                                    Continue with Personal Drive
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}