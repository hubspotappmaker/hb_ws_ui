'use client';
import React, { useEffect, useState } from 'react';
import { Button, Typography, Card, message, Spin, Input, Form, Alert, Tooltip } from 'antd';
import styled from 'styled-components';
import { connectHubspot, getSourceById } from '@/service/user/source';
import { ShopTwoTone } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import axios from "axios";

const { Title, Paragraph } = Typography;

// Styled components
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

const ReConnectHubspot: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [prefix, setPrefix] = useState<string>(''); // initialize as empty string
    const [prefixError, setPrefixError] = useState<string>('');
    const [form] = Form.useForm();
    const { id } = useParams() as { id: string };

    // Validate prefix
    const validatePrefix = (value: string): string => {
        // if (!value || value.trim() === '')
        // {
        //     return 'Prefix is required';
        // }
        if (value.length > 0 && value.length < 5)
        {
            return 'Prefix must be at least 5 characters';
        }
        if (value.length > 20)
        {
            return 'Prefix must not exceed 20 characters';
        }
        if (/[^a-z0-9]/.test(value))
        {
            return 'Prefix must not contain special characters or spaces';
        }
        return '';
    };

    const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setPrefix(value);

        const error = validatePrefix(value);
        setPrefixError(error);

        form.setFields([
            {
                name: 'prefix',
                errors: error ? [error] : [],
            },
        ]);
    };

    const isFormValid = (): boolean => {
        const current = prefix;
        return validatePrefix(current) === '';
    };

    const handleConnect = async () => {
        const finalPrefix = prefix;
        const error = validatePrefix(finalPrefix);
        if (error)
        {
            message.error(error);
            return;
        }
        try
        {
            setLoading(true);
            const url = await connectHubspot(finalPrefix);
            // window.location.href = url || '';
        } catch (err)
        {
            console.error('Error connecting to HubSpot:', err);
            message.error('Failed to reconnect to HubSpot. Please try again.');
        } finally
        {
            setLoading(false);
        }
    };

    const getDetailSource = async () => {
        const res = await getSourceById(id);
        return res;
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
                try
                {
                    const email = localStorage.getItem('email')
                    const res:any = await axios.get(`https://gdrive.nexce.io/connect-platform-app/application/check-hub-id?email=${email}`);
                    if(res.data && res.status == 200){
                        const portalId = res.data.data
                        console.log(portalId)

                        window.location.href = `https://gdrive.nexce.io/fe/auth?hubId=${email}`;
                    }
                    // window.location.href = response;
                } catch (error:any) {
                    console.error('Error connecting to Google Drive:', error);
                    message.error('Failed to connect to Google drive. Please try again.');
                } finally
                {
                    setLoading(false);
                }
        }
        )();
    }, [id, form]);

    return (
        <PageContainer>
            <HeaderContainer>
                <StyledTitle level={2}>Reconnect HubSpot</StyledTitle>
            </HeaderContainer>

            <ContentContainer>
                <Spin spinning={loading}>
                    <div style={{ padding: '40px 20px' }}>
                        <IconWrapper>
                            <ShopTwoTone style={{ fontSize: '40px', color: 'white' }} />
                        </IconWrapper>

                        <Title level={3} style={{ color: '#333', marginBottom: '16px' }}>
                            Reconnect Your Google Drive Account
                        </Title>

                        <StyledParagraph>
                            Connect your Google Driver account to seamlessly integrate your data.
                            This will allow you to access from your Google account.
                        </StyledParagraph>


                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                            <StyledButton
                                type="primary"
                                size="large"
                                onClick={handleConnect}
                                // disabled={!isFormValid()}
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

export default ReConnectHubspot;