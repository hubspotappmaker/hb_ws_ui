'use client'
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  theme
} from 'antd';
import {
  EnvironmentOutlined,
  MailOutlined,
  WhatsAppOutlined,
  GlobalOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  SendOutlined
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Title, Text, Paragraph } = Typography;

// Types
interface ContactItemProps {
  type: 'email' | 'phone' | 'website';
  value: string;
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

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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
  animation: ${float} 8s ease-in-out infinite;
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
  animation: ${fadeInUp} 0.8s ease-out;
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

const GlassCard = styled(Card)`
  background: #ffffff !important;
  border: 1px solid #e6f2ff;
  border-radius: 16px !important;
  box-shadow: 
    0 4px 20px rgba(22, 119, 255, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.8s ease-out 0.1s both;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 8px 30px rgba(22, 119, 255, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.04);
    border-color: #1677ff;
  }

  .ant-card-body {
    padding: 32px;
  }

  .ant-card-head {
    background: transparent;
    border-bottom: 1px solid #f0f5ff;
    padding: 20px 32px;
  }
`;

const ContactSection = styled.div`
  margin-bottom: 50px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8faff;
  border: 1px solid #e6f2ff;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(22, 119, 255, 0.05), transparent);
    transition: left 0.4s;
  }
  
  &:hover {
    background: #e6f2ff;
    transform: translateX(4px);
    border-color: #1677ff;
    
    &:before {
      left: 100%;
    }
  }
  
  .contact-icon {
    font-size: 20px;
    margin-right: 16px;
    color: #1677ff;
    background: rgba(22, 119, 255, 0.1);
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
  }
`;

const ContactText = styled.div`
  flex: 1;
`;

const ContactLabel = styled(Text)`
  display: block;
  color: #8c8c8c !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  margin-bottom: 2px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContactValue = styled(Button)`
  padding: 0 !important;
  height: auto !important;
  color: #262626 !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  text-align: left !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  
  &:hover {
    color: #1677ff !important;
    background: transparent !important;
  }
`;

const AddressCard = styled(GlassCard)`
  height: 100%;
  
  .address-line {
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    color: #262626;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
`;

const SocialSection = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.3s both;
`;

const SocialCard = styled(GlassCard)`
  text-align: center;
  
  .ant-card-head {
    text-align: center;
  }
`;

const SocialButton = styled(Button)`
  height: 48px !important;
  border-radius: 24px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    
    &:before {
      left: 100%;
    }
  }
  
  .anticon {
    font-size: 18px !important;
    margin-right: 8px !important;
  }
`;

const CardTitle = styled(Title)`
  color: #1677ff !important;
  margin: 0 !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center !important;
  font-size: 20px !important;
  
  .anticon {
    margin-right: 10px;
    font-size: 20px;
    color: #1677ff;
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(22, 119, 255, 0.08);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  
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

const FooterSection = styled.div`
  text-align: center;
  margin-top: 60px;
  padding: 30px;
  background: #f8faff;
  border-radius: 16px;
  border: 1px solid #e6f2ff;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const ContactInfo: React.FC = () => {
  const { token } = theme.useToken();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSocialClick = (url: string): void => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = ({ type, value }: ContactItemProps): void => {
    switch (type)
    {
      case 'email':
        window.open(`mailto:${value}`, '_self');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_self');
        break;
      case 'website':
        window.open(value, '_blank', 'noopener,noreferrer');
        break;
    }
  };

  if (!mounted) return null;

  return (
    <MainContainer>
      <BackgroundPattern />
      <FloatingElement />
      <FloatingElement />
      <FloatingElement />

      <ContentWrapper>
        <HeroSection>
          <HeroTitle level={1}>
            Contact ONEXT DIGITAL
          </HeroTitle>
          <HeroSubtitle>
            ONEXT DIGITAL provides digital transformation consulting services and multi-sector
            software solutions for domestic and international businesses.
          </HeroSubtitle>
        </HeroSection>

        <ContactSection>
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <AddressCard
                title={
                  <CardTitle level={3}>
                    <EnvironmentOutlined />
                    Head Office
                  </CardTitle>
                }
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div className="address-line">
                    2871 Hung Vuong Avenue
                  </div>
                  <div className="address-line">
                    Van Co Ward, Viet Tri City
                  </div>
                  <div className="address-line">
                    Phu Tho Province, Vietnam
                  </div>
                </Space>
              </AddressCard>
            </Col>

            <Col xs={24} lg={12}>
              <GlassCard
                title={
                  <CardTitle level={3}>
                    <SendOutlined />
                    Get in Touch
                  </CardTitle>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <ContactItem onClick={() => handleContactClick({ type: 'email', value: 'info@onextdigital.com' })}>
                    <div className="contact-icon">
                      <MailOutlined />
                    </div>
                    <ContactText>
                      <ContactLabel>Email</ContactLabel>
                      <ContactValue type="link">
                        info@onextdigital.com
                      </ContactValue>
                    </ContactText>
                  </ContactItem>

                  <ContactItem onClick={() => handleContactClick({ type: 'phone', value: '+84989302850' })}>
                    <div className="contact-icon">
                      <WhatsAppOutlined />
                    </div>
                    <ContactText>
                      <ContactLabel>WhatsApp</ContactLabel>
                      <ContactValue type="link">
                        +84 98 930 28 50
                      </ContactValue>
                    </ContactText>
                  </ContactItem>

                  <ContactItem onClick={() => handleContactClick({ type: 'website', value: 'https://onextdigital.com' })}>
                    <div className="contact-icon">
                      <GlobalOutlined />
                    </div>
                    <ContactText>
                      <ContactLabel>Website</ContactLabel>
                      <ContactValue type="link">
                        onextdigital.com
                      </ContactValue>
                    </ContactText>
                  </ContactItem>
                </Space>
              </GlassCard>
            </Col>
          </Row>
        </ContactSection>

        <SocialSection>
          <SocialCard
            title={
              <CardTitle level={2} style={{ justifyContent: 'center' }}>
                Connect With Us
              </CardTitle>
            }
          >
            <Row justify="center" gutter={[24, 24]} style={{ marginTop: '16px' }}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <SocialButton
                  type="primary"
                  size="large"
                  block
                  style={{
                    background: '#1877f2',
                    borderColor: '#1877f2'
                  }}
                  onClick={() => handleSocialClick("https://www.facebook.com/onextdigitalteam")}
                >
                  <FacebookOutlined />
                  Facebook
                </SocialButton>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <SocialButton
                  type="primary"
                  size="large"
                  block
                  style={{
                    background: '#0a66c2',
                    borderColor: '#0a66c2'
                  }}
                  onClick={() => handleSocialClick("https://vn.linkedin.com/company/onextdigital?trk=public_post_feed-actor-name")}
                >
                  <LinkedinOutlined />
                  LinkedIn
                </SocialButton>
              </Col>
            </Row>
          </SocialCard>
        </SocialSection>

        <FooterSection>
          <Text style={{
            color: '#8c8c8c',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            © {new Date().getFullYear()} ONEXT DIGITAL. All rights reserved.
          </Text>
        </FooterSection>
      </ContentWrapper>
    </MainContainer>
  );
};

export default ContactInfo;