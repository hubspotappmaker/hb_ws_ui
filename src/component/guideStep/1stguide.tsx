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
  color: '#1677ff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#ff0000',
  fontSize: 20,
  fontWeight: 600,
  borderBottom: '1px solid #e0e0e0',
};

const contentStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#0066ff',
  padding: '40px 24px',
};

const First = () => {
  return (
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>How to connect to HubSpot</Header>
        <Content style={contentStyle}>
          <Row justify="center">
            <Col span={24}>
              <Card
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    // padding: 40,
                    background: '#ffffff',
                  }}
              >
                <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
                  Step 1: Create Source
                </Title>

                {/* Step 1 */}
                <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={4}>
                    <img src="/images/source-icon.png" alt="Source" style={{ width: '100%' }} />
                  </Col>
                  <Col span={20}>
                    <Paragraph strong>
                      1. Go to the <Text strong>Source</Text> page and click <Text strong>Create New Source</Text>.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 2 */}
                <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={4}>
                    <img src="/images/hubspot-icon.png" alt="HubSpot" style={{ width: '100%' }} />
                  </Col>
                  <Col span={20}>
                    <Paragraph strong>
                      2. In the popup, select <Text strong>HubSpot</Text> to connect your CRM data.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 3 */}
                <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={4}>
                    <img src="/images/login-icon.png" alt="Login" style={{ width: '100%' }} />
                  </Col>
                  <Col span={20}>
                    <Paragraph strong>
                      3. Log in and authorize access to your <Text strong>HubSpot</Text> account.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 4 */}
                <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={4}>
                    <img src="/images/google-drive-icon.png" alt="Google Drive" style={{ width: '100%' }} />
                  </Col>
                  <Col span={20}>
                    <Paragraph strong>
                      4. After that, select <Text strong>Google Drive</Text> to import your files.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 5 */}
                <Row align="middle" gutter={16}>
                  <Col span={4}>
                    <img src="/images/permission-icon.png" alt="Permission" style={{ width: '100%' }} />
                  </Col>
                  <Col span={20}>
                    <Paragraph strong>
                      5. Grant <Text strong>Google Drive</Text> permission to complete the source connection.
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
