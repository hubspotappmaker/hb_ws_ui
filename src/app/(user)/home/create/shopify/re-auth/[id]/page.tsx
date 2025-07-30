'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Typography, Form, Card, message, Space, Spin, Alert, Modal } from 'antd';
import { LinkOutlined, ShopOutlined, KeyOutlined, GlobalOutlined, InfoCircleOutlined, SunOutlined, PlayCircleOutlined, WarningOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter, useParams } from 'next/navigation';
import { getSourceById, reAuthenShopidySource } from '@/service/user/source';

const { Title } = Typography;

// Main page container
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

// Styled title component
const StyledTitle = styled(Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
  
  @media (max-width: 768px) {
    font-size: 20px !important;
  }
`;

// Form card container
const FormContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    
    .ant-card-body {
      padding: 16px !important;
    }
  }
`;

// Form header with icon and title
const FormHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    margin: 0;
    margin-left: 12px;
    color: #1667ff;
    font-size: 18px;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    
    h3 {
      margin-left: 0;
      margin-top: 8px;
      font-size: 16px;
    }
  }
`;

// Form item wrapper
const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
  
  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    
    .ant-form-item-label {
      padding-bottom: 4px !important;
    }
    
    .ant-form-item-label > label {
      font-size: 14px;
    }
  }
`;

// Styled input field
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
    font-size: 14px !important;
    padding: 4px 10px !important;
  }
`;

// Main action buttons
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
    min-width: 120px;
    
    &:hover {
      transform: none;
    }
  }
`;

// Input label with icon
const InputLabel = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
  
  .icon {
    margin-right: 8px;
    color: #1667ff;
    font-size: 16px;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    
    .icon {
      font-size: 14px;
      margin-right: 6px;
    }
  }
`;

// Button container
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    margin-top: 24px;
    flex-direction: column;
    gap: 12px;
    
    .ant-space {
      width: 100% !important;
      flex-direction: column !important;
      
      .ant-space-item {
        width: 100% !important;
        
        button {
          width: 100% !important;
        }
      }
    }
  }
`;

// Icon container in form header
const IconContainer = styled.div`
  background-color: #1667ff;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 6px;
  }
`;

// Video Guide Button
const VideoGuideButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1667ff;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-top: 12px;
  border: 1px solid #e6f4ff;
  box-shadow: 0 4px 12px rgba(22, 103, 255, 0.15);
  background: linear-gradient(135deg, #e6f4ff 0%, #d6ebff 100%);
  border-color: #1667ff;
  transform: translateY(-1px);
    
  
  .play-icon {
    font-size: 16px;
    color: #1667ff;
  }
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 14px;
    
    .play-icon {
      font-size: 14px;
    }
  }
`;

// Video Modal Styles
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
    padding: 0;
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #1667ff 0%, #0f4fff 100%);
    border-bottom: none;
    padding: 16px 24px;
    margin-bottom: 0;
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }
  
  .ant-modal-close {
    color: white;
    
    &:hover {
      color: #f0f0f0;
    }
  }
  
  .ant-modal-body {
    padding: 0;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .ant-modal-header {
      padding: 12px 16px;
      
      .ant-modal-title {
        font-size: 16px;
      }
    }
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ReAuthen: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const id: any = params.id;
    const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
    const videoRef = useRef(null);
    const [sourceData, setSourceData] = useState<any>(null);

    // Get source data on component mount
    const getDataSource = async () => {
        try
        {
            setDataLoading(true);
            const res: any = await getSourceById(id);
            console.log("check data credentials: ", res.data.credentials);

            const credentials = res.data.credentials;
            setSourceData(res.data);

            // Pre-fill form with existing data
            form.setFieldsValue({
                name: res.data.name || '',
                shopUrl: credentials.shopUrl || '',
                accessToken: credentials.accessToken || ''
            });

        } catch (error)
        {
            console.error('Error fetching source data:', error);
            message.error('Failed to load source data');
        } finally
        {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (id)
        {
            getDataSource();
        }
    }, [id]);

    // URL validation function
    const validateShopUrl = (url: any) => {
        if (!url || typeof url !== 'string')
        {
            return { isValid: false, error: 'Shop URL is required' };
        }

        // Remove whitespace
        let cleanUrl = url.trim();

        // Auto add https:// if no protocol
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))
        {
            cleanUrl = 'https://' + cleanUrl;
        }

        // Check basic URL format
        try
        {
            const urlObj = new URL(cleanUrl);

            // Check if ends with .myshopify.com
            if (!urlObj.hostname.endsWith('.myshopify.com'))
            {
                return {
                    isValid: false,
                    error: 'Shop URL must end with .myshopify.com (e.g., your-store.myshopify.com)'
                };
            }

            // Check valid hostname format
            const shopName = urlObj.hostname.replace('.myshopify.com', '');
            if (!shopName || shopName.length < 1)
            {
                return {
                    isValid: false,
                    error: 'Invalid shop name in URL'
                };
            }

            // Check valid characters in shop name (only letters, numbers, and hyphens)
            if (!/^[a-zA-Z0-9-]+$/.test(shopName))
            {
                return {
                    isValid: false,
                    error: 'Shop name can only contain letters, numbers, and hyphens'
                };
            }

            return {
                isValid: true,
                correctedUrl: cleanUrl
            };
        } catch (error)
        {
            return {
                isValid: false,
                error: 'Invalid URL format'
            };
        }
    };

    // Custom validator for Shop URL
    const shopUrlValidator = async (_: any, value: any) => {
        if (!value)
        {
            return Promise.reject(new Error('Please enter your Shopify shop URL'));
        }

        const validation = validateShopUrl(value);

        if (!validation.isValid)
        {
            return Promise.reject(new Error(validation.error));
        }

        // Auto update value with corrected URL (with https://)
        if (validation.correctedUrl !== value)
        {
            form.setFieldsValue({ shopUrl: validation.correctedUrl });
        }

        return Promise.resolve();
    };

    const showVideoModal = () => {
        setIsVideoModalVisible(true);
    };

    const handleVideoModalClose = () => {
        if (videoRef.current)
        {
            const iframe = videoRef.current as any;
            const src = iframe.src;
            iframe.src = '';
            setTimeout(() => {
                iframe.src = src;
            }, 100);
        }
        setIsVideoModalVisible(false);
    };

    const handleSubmit = async (values: any) => {
        try
        {
            setLoading(true);

            // Extract shop name from URL
            const urlObj = new URL(values.shopUrl);
            const shopName = urlObj.hostname.replace('.myshopify.com', '');
            console.log("check values:L ", values)
            // Create the data object in the required format
            const data = {
                name: values.name,
                credentials: {
                    shopUrl: values.shopUrl,
                    shopName: values.name,
                    accessToken: values.accessToken
                }
            };

            // Call the reauth API
            const response = await reAuthenShopidySource(id, data);

            // Check if response is successful
            if (response.status === 200 || response.status === 201)
            {
                message.success('Shopify store re-authenticated successfully!');
                // router.push('/home/source');
            }
        } catch (error)
        {
            // Handle error
            console.error('Error re-authenticating Shopify store:', error);
            message.error('Failed to re-authenticate Shopify store. Please check your credentials and try again.');
        } finally
        {
            setLoading(false);
        }
    };

    if (dataLoading)
    {
        return (
            <PageContainer>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Re-authenticate Shopify</StyledTitle>
            </HeaderContainer>

            <FormContainer>
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <FormHeader>
                            <div style={{
                                backgroundColor: '#1667ff',
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShopOutlined style={{ fontSize: '20px', color: 'white' }} />
                            </div>
                            <h3>Re-authenticate Shopify Store</h3>
                        </FormHeader>

                        <StyledFormItem
                            name="name"
                            label={
                                <InputLabel>
                                    <LinkOutlined className="icon" />
                                    <span>Integration Name</span>
                                </InputLabel>
                            }
                            rules={[{ required: true, message: 'Please enter an integration name' }]}
                        >
                            <StyledInput
                                placeholder="Enter a name for this integration (e.g. My Shopify Store)"
                                size="large"
                            />
                        </StyledFormItem>

                        <StyledFormItem
                            name="shopUrl"
                            label={
                                <InputLabel>
                                    <GlobalOutlined className="icon" />
                                    <span>Shop URL</span>
                                </InputLabel>
                            }
                            rules={[
                                { validator: shopUrlValidator }
                            ]}
                        >
                            <StyledInput
                                placeholder="Enter your Shopify shop URL (e.g. your-store.myshopify.com)"
                                size="large"
                                onBlur={(e) => {
                                    // Auto format URL when user leaves field
                                    const validation = validateShopUrl(e.target.value);
                                    if (validation.isValid && validation.correctedUrl !== e.target.value)
                                    {
                                        form.setFieldsValue({ shopUrl: validation.correctedUrl });
                                    }
                                }}
                            />
                        </StyledFormItem>

                        <StyledFormItem
                            name="accessToken"
                            label={
                                <InputLabel>
                                    <KeyOutlined className="icon" />
                                    <span>Access Token</span>
                                </InputLabel>
                            }
                            rules={[{ required: true, message: 'Please enter your Shopify access token' }]}
                        >
                            <StyledInput.Password
                                placeholder="Enter your Shopify access token"
                                size="large"
                            />
                        </StyledFormItem>

                        <ButtonContainer>
                            <Space>
                                <StyledButton type="default" size="large" onClick={() => router.push('/home/source')}>
                                    Cancel
                                </StyledButton>
                                <StyledButton type="primary" size="large" htmlType="submit">
                                    Authentication
                                </StyledButton>
                            </Space>
                        </ButtonContainer>
                    </Form>
                </Spin>
            </FormContainer>

            <Alert
                style={{
                    marginTop: 20,
                    borderColor: '#1890ff',
                    backgroundColor: '#e6f7ff',
                    padding: '16px 20px',
                }}
                message={
                    <span
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '0.25em',
                        }}
                    >
                        Note: Permissions You Need to Grant for the Shopify App
                    </span>
                }
                description={
                    <>
                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1f2f3f',
                                lineHeight: 1.5,
                                margin: 0,
                            }}
                        >
                            To connect your app with Shopify, you need to grant access to the following permissions:
                        </p>
                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1f2f3f',
                                lineHeight: 1.5,
                                marginTop: 8,
                            }}
                        >
                            Write and read customer information (write_customers, read_customers)
                        </p>
                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1f2f3f',
                                lineHeight: 1.5,
                                marginTop: 8,
                            }}
                        >
                            Write and read orders (write_orders, read_orders)
                        </p>
                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1f2f3f',
                                lineHeight: 1.5,
                                marginTop: 8,
                            }}
                        >
                            Write and read products (write_products, read_products)
                        </p>

                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1f2f3f',
                                lineHeight: 1.5,
                                marginTop: 8,
                            }}
                        >
                            Read publications (read_publications)
                        </p>

                        <VideoGuideButton onClick={showVideoModal}>
                            <PlayCircleOutlined className="play-icon" />
                            <span>Watch Setup Video Guide</span>
                        </VideoGuideButton>
                    </>
                }
                type="info"
                showIcon
            />
            <Alert
                style={{
                    margin: '20px 0px'
                }}
                message={
                    <span
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '0.25em',
                        }}
                    >
                        Note:
                    </span>
                }
                description={
                    <span>
                        Please note that the <strong>Shop URL</strong> must be the original Shopify store address provided when your account was created typically ending in <strong>myshopify.com</strong> and not a custom or redirected domain.
                    </span>
                }
                type="info"
                showIcon
                icon={<WarningOutlined />}
            />
            <Alert
                style={{
                    margin: '20px 0px'
                }}
                message={
                    <span
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            marginBottom: '0.25em',
                        }}
                    >
                        Tip:
                    </span>
                }
                description="If you forget your Shopify access token, you can uninstall and reinstall the app on Shopify to generate a new token without needing to create a new app."
                type="warning"
                showIcon
                icon={<SunOutlined />}
            />
            <StyledModal
                title="Shopify Integration Setup Guide"
                open={isVideoModalVisible}
                onCancel={handleVideoModalClose}
                footer={null}
                width={800}
                centered
                destroyOnClose={true}
            >
                <VideoContainer>
                    <iframe
                        ref={videoRef}
                        src="https://www.youtube.com/embed/V3WgWfyLKok?enablejsapi=1&controls=1"
                        title="Shopify Integration Setup Guide"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </VideoContainer>
            </StyledModal>
        </PageContainer>
    );
};

export default ReAuthen;