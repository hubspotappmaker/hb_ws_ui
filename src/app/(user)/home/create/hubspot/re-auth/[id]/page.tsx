'use client';
import React, { useEffect, useState } from 'react';
import { Button, Typography, Card, message, Spin, Input, Form, Alert, Tooltip } from 'antd';
import styled from 'styled-components';
import { connectHubspot, getSourceById } from '@/service/user/source';
import { ShopTwoTone } from '@ant-design/icons';
import { useParams } from 'next/navigation';

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
            const oauthUrl = `https://app-na2.hubspot.com/oauth/authorize?client_id=ed661cf6-11ca-4441-8f9f-dcc884d8e6f9&redirect_uri=https://gdrive.nexce.io/fe/api/hubspot/callback&scope=crm.objects.contacts.write%20crm.objects.deals.read%20crm.objects.deals.write%20crm.objects.contacts.read`
            window.location.href = oauthUrl;
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

    // useEffect(() => {
    //     (async () => {
    //         setLoading(true);
    //         try
    //         {
    //             const data = await getDetailSource();
    //             const fetched = data.data.credentials.prefix;
    //             setPrefix(fetched);
    //             form.setFieldsValue({ prefix: fetched });
    //         } catch (err)
    //         {
    //             console.error('Fetch source error:', err);
    //         } finally
    //         {
    //             setLoading(false);
    //         }
    //     })();
    // }, [id, form]);

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
                            Reconnect Your HubSpot Account
                        </Title>

                        <StyledParagraph>
                            Reconnect your HubSpot account to restore access to your underlineeting, sales, and CRM data.
                            This will re-establish the connection to access contacts, companies, deals, and other information from your HubSpot account.
                        </StyledParagraph>

                        <FormContainer>
                            <Form form={form} layout="vertical">
                                {/*<Form.Item*/}
                                {/*    label="Prefix"*/}
                                {/*    name="prefix"*/}
                                {/*    validateStatus={prefixError ? 'error' : ''}*/}
                                {/*    // help={prefixError || `${prefix.length}/20 characters`}*/}
                                {/*    style={{ textAlign: 'left' }}*/}
                                {/*>*/}
                                    {/*<Tooltip*/}
                                    {/*    placement="rightTop"*/}
                                    {/*    title="We will create custom fields based on Shopify's standard fields. Kindly specify a prefix or leave it blank for these fields"*/}
                                    {/*    color='blue'*/}
                                    {/*>*/}
                                    {/*    <StyledInput*/}
                                    {/*        placeholder="hubspot_"*/}
                                    {/*        value={prefix}*/}
                                    {/*        onChange={handlePrefixChange}*/}
                                    {/*        showCount*/}
                                    {/*        maxLength={20}*/}
                                    {/*    />*/}
                                    {/*</Tooltip>*/}
                                {/*</Form.Item>*/}
                            </Form>
                        </FormContainer>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                            <StyledButton
                                type="primary"
                                size="large"
                                onClick={handleConnect}
                                disabled={!isFormValid()}
                            >
                                Reconnect to HubSpot
                            </StyledButton>
                        </div>

                        {/*<Alert*/}
                        {/*    message="Important Note"*/}
                        {/*    description="Avoid changing the prefix frequently. If you change the prefix, you will need to reconfigure all metafield mappings and settings."*/}
                        {/*    type="warning"*/}
                        {/*    showIcon*/}
                        {/*    style={{*/}
                        {/*        margin: '24px auto',*/}
                        {/*        textAlign: 'left',*/}
                        {/*        maxWidth: '600px',*/}
                        {/*    }}*/}
                        {/*/>*/}

                        <Paragraph style={{ marginTop: '24px', fontSize: '14px', color: '#888' }}>
                            You'll be redirected to HubSpot to reauthorize access to your account.
                        </Paragraph>
                    </div>
                </Spin>
            </ContentContainer>
        </PageContainer>
    );
};

export default ReConnectHubspot;