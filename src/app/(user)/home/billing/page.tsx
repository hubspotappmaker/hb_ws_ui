'use client'
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  theme,
  Badge,
  Spin,
  message,
  Alert
} from 'antd';
import {
  CrownOutlined,
  CheckOutlined,
  StarFilled,
  ShoppingCartOutlined,
  UserOutlined,
  DatabaseOutlined,
  LinkOutlined,
  SyncOutlined
} from '@ant-design/icons';
import styled, { keyframes, css } from 'styled-components';
import { getAllTier } from "@/service/admin/tier";
import { pingMe } from "@/service/user/auth";

const { Title, Text, Paragraph } = Typography;

// Types
interface TierData {
  _id: string;
  name: string;
  isActive: boolean;
  connectLimit: number;
  appLimit: number;
  orderSyncLimit: number;
  productSyncLimit: number;
  customerSyncLimit: number;
  metafieldLimit: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  connectedApps: any[];
  tier: string;
  role: string;
  emailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TierResponse {
  status: number;
  data: {
    data: TierData[];
    page: number;
    size: number;
    totalPage: number;
    totalRecord: number;
  };
  msg: string;
}

interface UserResponse {
  status: number;
  data: UserData[];
  msg: string;
}

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(22, 119, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(22, 119, 255, 0.5); }
`;

// Styled Components
const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 50%, #ffffff 100%);
  position: relative;
  overflow-x: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(22, 119, 255, 0.05) 1px, transparent 1px),
    radial-gradient(circle at 80% 50%, rgba(22, 119, 255, 0.05) 1px, transparent 1px);
  background-size: 80px 80px;
  ${css`animation: ${float} 8s ease-in-out infinite;`}
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  ${css`animation: ${fadeInUp} 0.8s ease-out;`}
`;

const HeroTitle = styled(Title)`
  font-size: clamp(2rem, 4vw, 3.2rem) !important;
  font-weight: 700 !important;
  color: #1677ff !important;
  margin-bottom: 20px !important;
  letter-spacing: -0.5px;
`;

const HeroSubtitle = styled(Paragraph)`
  font-size: 16px !important;
  color: #666666 !important;
  max-width: 600px;
  margin: 0 auto 30px auto !important;
  line-height: 1.6 !important;
  font-weight: 400;
`;

const TierCard = styled(Card) <{ isCurrentTier: boolean; isPopular?: boolean }>`
  background: #ffffff !important;
  border: 2px solid ${props => props.isCurrentTier ? '#1677ff' : '#e6f2ff'};
  border-radius: 12px !important;
  box-shadow: 
    0 2px 12px rgba(22, 119, 255, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  ${css`animation: ${fadeInUp} 0.8s ease-out 0.1s both;`}
  position: relative;
  height: 100%;
  min-width: 280px;
  max-width: 320px;
  flex-shrink: 0;
  
  ${props => props.isCurrentTier && css`
    animation: ${glow} 2s ease-in-out infinite;
    transform: scale(1.02);
  `}
  
  &:hover {
    transform: translateY(-4px) ${props => props.isCurrentTier ? 'scale(1.0)' : 'scale(1.01)'};
    box-shadow: 
      0 6px 24px rgba(22, 119, 255, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.04);
    border-color: #1677ff;
  }

  .ant-card-body {
    padding: 24px 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-head {
    background: ${props => props.isCurrentTier ? '#1677ff !important' : 'transparent !important'};
    border-bottom: 1px solid #f0f5ff;
    padding: 16px 20px;
    border-radius: 10px 10px 0 0;
    min-height: auto;
  }

  .ant-card-head-title {
    padding: 0;
  }
`;

const TierBadge = styled(Badge)`
  position: absolute;
  top: -8px;
  right: 16px;
  z-index: 10;
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 20px;
  padding-top: 20px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #40a9ff;
  }
`;

const TierContainer = styled.div`
  display: flex;
  gap: 24px;
  min-width: min-content;
  padding: 0 20px;
`;

const TierName = styled(Title) <{ color?: string }>`
  color: ${props => props.color || '#1677ff'} !important;
  margin: 0 !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1.2 !important;
  
  .anticon {
    margin-right: 6px;
    font-size: 18px;
  }
`;

const FeatureList = styled.div`
  flex: 1;
  margin: 16px 0;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .feature-icon {
    color: #1677ff;
    font-size: 14px;
    margin-right: 8px;
    min-width: 14px;
  }
  
  .feature-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .feature-label {
    font-size: 12px;
    color: #666666;
    font-weight: 500;
  }
  
  .feature-value {
    font-size: 14px;
    color: #1677ff;
    font-weight: 700;
  }
`;

const ActionButton = styled(Button) <{ isCurrentTier: boolean }>`
  height: 40px !important;
  border-radius: 20px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin-top: 16px;
  
  ${props => props.isCurrentTier ? css`
    background: #1677ff !important;
    border-color: #1677ff !important;
    color: white !important;
    cursor: default;
  ` : css`
    background: #1677ff !important;
    border-color: #1677ff !important;
    color: white !important;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(22, 119, 255, 0.3);
      background: #40a9ff !important;
      border-color: #40a9ff !important;
    }
  `}
  
  .anticon {
    font-size: 14px !important;
    margin-right: 6px !important;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(22, 119, 255, 0.08);
  border-radius: 50%;
  ${css`animation: ${float} 6s ease-in-out infinite;`}
  
  &:nth-child(1) {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 25%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
  }
`;

const BillingPage: React.FC = () => {
  const { token } = theme.useToken();
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [currentUserTier, setCurrentUserTier] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try
      {
        setLoading(true);

        const [tiersResponse, userResponse] = await Promise.all([
          getAllTier(1, 100),
          pingMe()
        ]);

        console.log("check : getAllTier", tiersResponse);
        console.log("check : userResponse", userResponse);

        // Sửa chỗ này:
        if (tiersResponse.status === 200)
        {
          // tiersResponse.data.data là mảng TierData[]
          setTiers(tiersResponse.data.data);
        }

        if (userResponse.status === 200 && userResponse.data.length > 0)
        {
          setCurrentUserTier(userResponse.data[0].tier);
        }

      } catch (error)
      {
        console.error('Error fetching data:', error);
        message.error('Failed to load billing information');
      } finally
      {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = (tierName: string): void => {
    window.open('https://app.onextdigital.com/app/shopify-hubspot-sync-app/', '_blank', 'noopener,noreferrer');
  };

  const getFeatureIcon = (featureName: string) => {
    switch (featureName)
    {
      case 'Connect Limit':
        return <LinkOutlined className="feature-icon" />;
      case 'App Limit':
        return <DatabaseOutlined className="feature-icon" />;
      case 'Order Sync Limit':
        return <SyncOutlined className="feature-icon" />;
      case 'Product Sync Limit':
        return <ShoppingCartOutlined className="feature-icon" />;
      case 'Customer Sync Limit':
        return <UserOutlined className="feature-icon" />;
      case 'Metafield Limit':
        return <DatabaseOutlined className="feature-icon" />;
      default:
        return <CheckOutlined className="feature-icon" />;
    }
  };

  const formatNumber = (num: number): string => {
    if (num > 100000)
    {
      return '∞'
    }
    return num.toString();
  };

  if (loading)
  {
    return (
      <MainContainer>
        <BackgroundPattern />
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <BackgroundPattern />
      <FloatingElement />
      <FloatingElement />
      <FloatingElement />

      <ContentWrapper>
        <HeroSection>
          <HeroTitle level={1}>
            Choose Your Plan
          </HeroTitle>
          <HeroSubtitle>
            Select the perfect tier for your business needs. Upgrade or downgrade anytime.
          </HeroSubtitle>
        </HeroSection>

        <ScrollContainer>
          <TierContainer>
            {tiers.map((tier, index) => {
              const isCurrentTier = tier._id === currentUserTier;
              const isPopular = tier.name.toLowerCase().includes('god') || tier.name.toLowerCase().includes('premium');

              return (
                <TierCard
                  key={tier._id}
                  isCurrentTier={isCurrentTier}
                  isPopular={isPopular}
                  title={
                    <TierName color={isCurrentTier ? '#ffffff' : '#1677ff'}>
                      <CrownOutlined />
                      {tier.name}
                    </TierName>
                  }
                  extra={
                    isPopular && !isCurrentTier ? (
                      <TierBadge count="Popular" style={{ backgroundColor: '#ff4d4f' }} />
                    ) : isCurrentTier ? (
                      <TierBadge count="Current" style={{
                        backgroundColor: '#1677ff',
                        marginTop: 16,
                        marginLeft: 13,
                      }} />
                    ) : null
                  }
                >
                  <FeatureList>
                    <FeatureItem>
                      {getFeatureIcon('Connect Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Connect Limit</span>
                        <span className="feature-value">{formatNumber(tier.connectLimit)}</span>
                      </div>
                    </FeatureItem>

                    <FeatureItem>
                      {getFeatureIcon('App Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Source Limit</span>
                        <span className="feature-value">{formatNumber(tier.appLimit)}</span>
                      </div>
                    </FeatureItem>

                    <FeatureItem>
                      {getFeatureIcon('Order Sync Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Order Sync</span>
                        <span className="feature-value">{formatNumber(tier.orderSyncLimit)}</span>
                      </div>
                    </FeatureItem>

                    <FeatureItem>
                      {getFeatureIcon('Product Sync Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Product Sync</span>
                        <span className="feature-value">{formatNumber(tier.productSyncLimit)}</span>
                      </div>
                    </FeatureItem>

                    <FeatureItem>
                      {getFeatureIcon('Customer Sync Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Customer Sync</span>
                        <span className="feature-value">{formatNumber(tier.customerSyncLimit)}</span>
                      </div>
                    </FeatureItem>

                    <FeatureItem>
                      {getFeatureIcon('Metafield Limit')}
                      <div className="feature-text">
                        <span className="feature-label">Metafield Limit</span>
                        <span className="feature-value">{formatNumber(tier.metafieldLimit)}</span>
                      </div>
                    </FeatureItem>
                  </FeatureList>

                  <ActionButton
                    isCurrentTier={isCurrentTier}
                    size="large"
                    block
                    onClick={() => !isCurrentTier && handleUpgrade(tier.name)}
                    disabled={isCurrentTier}
                  >
                    {isCurrentTier ? (
                      <>
                        <CheckOutlined />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <ShoppingCartOutlined />
                        Choose Plan
                      </>
                    )}
                  </ActionButton>
                </TierCard>
              );
            })}
          </TierContainer>
        </ScrollContainer>
      </ContentWrapper>
      <Alert
        style={{
          maxWidth: '80%',
          margin: '0 auto',
          marginBottom: 50
        }}
        description={
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                margin: '0 auto',
              }}
            >
              <p style={{ marginBottom: '1rem' }}>
                Manage your orders and subscriptions. Visit your Account page to view
                order history, order status, and active subscriptions.
              </p>
              <button
                style={
                  isHovered
                    ? {
                      background: 'linear-gradient(90deg,rgb(214, 54, 86), #1e90ff)',
                      border: 'none',
                      borderRadius: '9999px',
                      color: '#ffffff',
                      padding: '0.6rem 1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }
                    : {
                      background: 'linear-gradient(90deg,rgb(164, 104, 207), #1e90ff)',
                      border: 'none',
                      borderRadius: '9999px',
                      color: '#ffffff',
                      padding: '0.6rem 1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                  window.open('https://nexce.io/my-account/', '_blank', 'noopener,noreferrer');
                }}
              >
                Go to My Account
              </button>
            </div>
          </>
        }
        type="info"
      />
    </MainContainer>
  );
};

export default BillingPage; 