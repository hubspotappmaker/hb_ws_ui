'use client';
import React, { useState } from 'react';
import { Button, Typography, Card, message, Spin, Input, Form, Tooltip } from 'antd';
import styled from 'styled-components';
import {connectGoogleDrive, connectHubspot} from '@/service/user/source';
import { QuestionCircleOutlined, ShopTwoTone } from '@ant-design/icons';
import axios from "axios";

const { Title, Paragraph } = Typography;

// Define styled components to match the existing style
const PageContainer = styled.div`
  padding: 24px;
  background-color: white;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledTitle = styled(Title)`
  color: #1667ff !important;
  margin-bottom: 0 !important;
`;

const ContentContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  text-align: center;
`;

const IconWrapper = styled.div`
  margin: 0 auto 24px;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px #0958d9;
`;

const StyledButton = styled(Button)`
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(255, 87, 34, 0.2);
  transition: all 0.3s;
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 16px;
  margin-bottom: 32px;
  color: #505050;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto 24px;
  text-align: left;
`;

const StyledInput = styled(Input)`
  height: 40px;
  border-radius: 6px;
  font-size: 14px;
`;

const ConnectHubspot: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [prefix, setPrefix] = useState('');
    const [prefixError, setPrefixError] = useState('');
    const [form] = Form.useForm();

    // Validate prefix function
    const validatePrefix = (value: string) => {
        if (!value || value.trim() === '')
        {
            return 'Prefix is required';
        }

        if (value.length > 0 && value.length < 5)
        {
            return 'Prefix must be at least 5 characters';
        }

        if (value.length > 20)
        {
            return 'Prefix must not exceed 20 characters';
        }

        // Check for special characters and spaces
        const specialCharRegex = /[^a-z0-9]/;
        if (specialCharRegex.test(value))
        {
            return 'Prefix must not contain special characters or spaces';
        }

        return '';
    };

    const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase(); // Convert to lowercase automatically
        setPrefix(value);

        const error = validatePrefix(value);
        setPrefixError(error);

        // Update form field error
        form.setFields([
            {
                name: 'prefix',
                errors: error ? [error] : [],
            },
        ]);
    };

    const isFormValid = () => {
        const currentPrefix = prefix;
        return validatePrefix(currentPrefix) === '';
    };

    const handleConnect = async () => {
        try
        {
            setLoading(true);
            const finalPrefix = prefix;

            // Final validation before connecting
            const error = validatePrefix(finalPrefix);
            if (error)
            {
                message.error(error);
                return;
            }

            const email = localStorage.getItem('email')


            const res:any = await axios.get(`https://gdrive.onextdigital.com/connect-platform-app/application/check-hub-id?email=${email}`);
            if(res.data && res.status == 200){
                const portalId = res.data.data
                console.log(portalId)

                window.location.href = `https://gdrive.onextdigital.com/fe/auth?hubId=${email}`;
            }
            // window.location.href = response;
        } catch (error:any) {
        if(error.response?.status === 400){
            message.error('You will need to connect to HubSpot to use this feature.');
        }else{

            console.error('Error connecting to HubSpot:', error);
            message.error('Failed to connect to HubSpot. Please try again.');
        }
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Connect Google Drive</StyledTitle>
            </HeaderContainer>

            <ContentContainer>
                <Spin spinning={loading}>
                    <div style={{ padding: '40px 20px' }}>
                        <IconWrapper>
                            <ShopTwoTone style={{ fontSize: '40px', color: 'white' }} />
                        </IconWrapper>

                        <Title level={3} style={{ color: '#333', marginBottom: '16px' }}>
                            Connect Your Google Drive Account
                        </Title>

                        <StyledParagraph>
                            Connect your Google Driver account to seamlessly integrate your data.
                            This will allow you to access from your Google account.
                        </StyledParagraph>

                        <Tooltip
                            placement="rightTop"
                            title="We will create custom fields based on Hubspot's standard fields. Kindly specify a prefix or leave it blank for these fields"
                            color='blue'
                        >
                            <StyledInput
                                placeholder="hubspot_"
                                value={prefix}
                                onChange={handlePrefixChange}
                                showCount
                                maxLength={20}
                            />
                        </Tooltip>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                            <StyledButton
                                type="primary"
                                size="large"
                                onClick={handleConnect}
                                disabled={!isFormValid()}
                            >
                                Connect to Google Drive
                            </StyledButton>
                        </div>

                        <Paragraph style={{ marginTop: '24px', fontSize: '14px', color: '#888' }}>
                            You'll be redirected to Google to authorize access to your account.
                        </Paragraph>
                    </div>
                </Spin>
            </ContentContainer>
        </PageContainer>
    );
};

export default ConnectHubspot;