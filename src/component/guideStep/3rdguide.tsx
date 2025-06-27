'use client'

import React from 'react';
import { Card, Layout, Typography, Row, Col, Avatar } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Header, Content,Footer } = Layout;

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
  height: '400px',
  // backgroundColor: '#0066ff',
  // padding: '40px 24px',
  borderRadius: 5,

};

const Third = () => {
  return (
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Title level={4} style={{ textAlign: 'center', marginBottom: 32 ,color:'white'}}>
            User Guide
          </Title>
        </Header>
        <Content style={contentStyle}>
          <Row justify="center"  align="stretch" >
            <Col span={24}>
              <Card
                  style={{
                    height: '100%',               // Force it to fill parent
                    minHeight: '600px',           // Prevent it from collapsing
                    display: 'flex',              // Flex container
                    flexDirection: 'column',      // Stack children
                    justifyContent: 'space-between', // or center if you want vertical center
                    backgroundImage: 'linear-gradient(to bottom right, #0958d9, #003eb3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    padding: 40,
                  }}
              >
                <Title level={2} style={{ textAlign: 'center', marginBottom: 32 ,color:'white'}}>
                  Step 3: Connect cross platform
                </Title>

                <Row align="middle" gutter={16}
                    // style={{
                    //   padding: '48px 18px',
                    // }}
                >
                  <Col Col xs={24} sm={22} md={20}>
                    <img src="/img/side-connect.png" alt="HubSpot"
                         style={{
                             width: '66%',        // full width of column
                             maxWidth: 500,        // prevent it from getting too big
                             // margin: '0 auto',     // center the image horizontally
                             borderRadius: 8,      // optional: soft corners
                             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // optional: nice shadow
                         }}/>
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      1. Go to the <Text strong underline style={{ color: '#b9deff' }} >Connect</Text> page and click  <Text strong underline style={{ color: '#b9deff' }}> Create Connection</Text>. </Paragraph>
                  </Col>
                </Row>

                {/* Step 2 */}
                <Row align="middle" gutter={16}
                    // style={{
                    //   padding: '48px 18px',
                    // }}
                >
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <img src="/img/conectsource.png" alt="HubSpot"
                         style={{
                           width: '80%',        // full width of column
                           maxWidth: 500,        // prevent it from getting too big
                           // margin: '0 auto',     // center the image horizontally
                           borderRadius: 8,      // optional: soft corners
                           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // optional: nice shadow
                         }}
                    />
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      2. In the popup, enter <Text strong underline style={{ color: '#b9deff' }}>Description</Text> to describe your connection name.
                    </Paragraph>
                  </Col>
                </Row>

                {/* Step 3 */}
                <Row align="middle" gutter={16}>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <img src="/img/connecttion-chose.png" alt="HubSpot"
                         style={{
                             width: '80%',        // full width of column
                             maxWidth: 500,        // prevent it from getting too big
                             // margin: '0 auto',     // center the image horizontally
                             borderRadius: 8,      // optional: soft corners
                             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' // optional: nice shadow
                         }}
                    />
                  </Col>
                  <Col Col xs={24} sm={22} md={20} lg={16} xl={14}>
                    <Paragraph strong style={{ color: '#fff' }}>
                      3. From each dropdown, select<Text strong  style={{ color: '#ff6600' }}> HubSpot </Text> account and
                      the corresponding
                      <Text strong  style={{ color: '#00ff11' }}>  Google Drive</Text>  to connect.
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

export default Third;
