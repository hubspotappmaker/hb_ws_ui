'use client'

import React from 'react';
import {
  ForkOutlined,
  ApiOutlined,
  BookOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Layout, Typography, Row, Col, Avatar } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Header, Content } = Layout;

const layoutStyle = {
  borderRadius: 8,
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 64,
  // paddingInline: 48,
  lineHeight: '64px',
  fontSize: 20,
  fontWeight: 600,
  borderRadius: 5,
  backgroundImage: 'linear-gradient(to bottom right, #0958d9, #003eb3)'

};

const contentStyle: React.CSSProperties = {
  minHeight: '100vh',
  // backgroundColor: '#0066ff',
  // padding: '40px 24px',
  borderRadius: 5,

};

const First = () => {
  return (
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 32 ,color:'white'}}>
            How to connect to HubSpot
          </Title>
        </Header>
        <Content style={contentStyle}>
          <Row justify="center" >
            <Col span={24}>
              <Card
                  style={{
                    width: '100%',
                    minHeight: '100vh',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    padding: 40,
                    backgroundImage: 'linear-gradient(to bottom right, #0958d9, #003eb3)'
                  }}
                  bodyStyle={{ padding: 0 }}
              >
                <Title level={4} style={{ textAlign: 'center', marginBottom: 32 ,color:'white'}}>
                  Step 1: Create Source
                </Title>

                {/* Step 1 */}
                <Row align="middle" gutter={16}
                     // style={{
                     //   padding: '48px 18px',
                     // }}
                >
                  <Col Col xs={24} sm={22} md={20}>
                    <img src="/img/source.png" alt="HubSpot" style={{ width: '69%' }} />
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      1. Go to the <Text strong>Source</Text> page and click <Text strong>Create New Source</Text>.                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 2 */}
                <Row align="middle" gutter={16}
                     // style={{
                     //   padding: '48px 18px',
                     // }}
                >
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                      <img src="/img/chosing-connect.png" alt="HubSpot" style={{ width: '100%' }} />
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      2. In the popup, select <Text strong>HubSpot</Text> to connect your CRM data.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 3 */}
                <Row align="middle" gutter={16}
                     // style={{
                     //   padding: '48px 24px',
                     // }}
                >
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                      <img src="/img/connect-hubspot.png" alt="HubSpot" style={{ width: '100%' }} />
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      3. Log in and authorize access to your <Text strong>HubSpot</Text> account.
                    </Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
  );
};

export default First;
