'use client'

import React from 'react';
import { Carousel, Card, Typography, Row, Col, Steps, Button } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GuidePage = () => {
    const carouselRef: any = React.useRef(null);
    const [currentStep, setCurrentStep] = React.useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1)
        {
            setCurrentStep(currentStep + 1);
            carouselRef.current?.goTo(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0)
        {
            setCurrentStep(currentStep - 1);
            carouselRef.current?.goTo(currentStep - 1);
        }
    };

    const goToStep = (step: any) => {
        setCurrentStep(step);
        carouselRef.current?.goTo(step);
    };

    const steps = [
        {
            title: "Create HubSpot Source",
            description: "Connect your CRM data",
            content: (
                <div className="guide-step">
                    <div className="step-header">
                        <Title level={2} style={{ color: '#1667ff', marginBottom: 8 }}>
                            Step 1: Create HubSpot Source
                        </Title>
                        <Paragraph style={{ color: '#666', fontSize: 16 }}>
                            Connect your HubSpot CRM to start syncing your customer data
                        </Paragraph>
                    </div>

                    <div className="steps-container">
                        <Row gutter={[32, 32]} align="middle">
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/source.png"
                                        alt="Create Source"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">1</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Go to the <Text strong style={{ color: '#1667ff' }}>Source</Text> page and click
                                            <Text strong style={{ color: '#1667ff' }}> Create New Source</Text>
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12} order={2}>
                                <div className="image-container">
                                    <img
                                        src="/img/chosing-connect.png"
                                        alt="Choose HubSpot"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12} order={1}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">2</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            In the popup, select <Text strong style={{ color: '#ff6b35' }}>HubSpot</Text> to connect your CRM data
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/connect-hubspot.png"
                                        alt="Connect HubSpot"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">3</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Log in and authorize access to your <Text strong style={{ color: '#ff6b35' }}>HubSpot</Text> account
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        },
        {
            title: "Create Google Drive Source",
            description: "Connect your storage data",
            content: (
                <div className="guide-step">
                    <div className="step-header">
                        <Title level={2} style={{ color: '#1667ff', marginBottom: 8 }}>
                            Step 2: Create Google Drive Source
                        </Title>
                        <Paragraph style={{ color: '#666', fontSize: 16 }}>
                            Connect your Google Drive to access and sync your documents
                        </Paragraph>
                    </div>

                    <div className="steps-container">
                        <Row gutter={[32, 32]} align="middle">
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/source.png"
                                        alt="Create Source"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">1</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Go to the <Text strong style={{ color: '#1667ff' }}>Source</Text> page and click
                                            <Text strong style={{ color: '#1667ff' }}> Create New Source</Text>
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12} order={2}>
                                <div className="image-container">
                                    <img
                                        src="/img/chosing-connect.png"
                                        alt="Choose Google Drive"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12} order={1}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">2</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            In the popup, select <Text strong style={{ color: '#34d399' }}>Google Drive</Text> to connect your storage data
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/connect-google.png"
                                        alt="Connect Google Drive"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">3</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Log in and authorize access to your <Text strong style={{ color: '#34d399' }}>Google Drive</Text> account
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        },
        {
            title: "Connect Cross Platform",
            description: "Link your sources together",
            content: (
                <div className="guide-step">
                    <div className="step-header">
                        <Title level={2} style={{ color: '#1667ff', marginBottom: 8 }}>
                            Step 3: Connect Cross Platform
                        </Title>
                        <Paragraph style={{ color: '#666', fontSize: 16 }}>
                            Create connections between your HubSpot and Google Drive sources
                        </Paragraph>
                    </div>

                    <div className="steps-container">
                        <Row gutter={[32, 32]} align="middle">
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/side-connect.png"
                                        alt="Connect Page"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">1</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Go to the <Text strong style={{ color: '#1667ff' }}>Connect</Text> page and click
                                            <Text strong style={{ color: '#1667ff' }}> Create Connection</Text>
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12} order={2}>
                                <div className="image-container">
                                    <img
                                        src="/img/conectsource.png"
                                        alt="Connection Description"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12} order={1}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">2</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Enter a <Text strong style={{ color: '#1667ff' }}>Description</Text> to name your connection
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={[32, 32]} align="middle" style={{ marginTop: 40 }}>
                            <Col xs={24} lg={12}>
                                <div className="image-container">
                                    <img
                                        src="/img/connecttion-chose.png"
                                        alt="Choose Sources"
                                        style={{
                                            width: '100%',
                                            maxWidth: 400,
                                            borderRadius: 12,
                                            boxShadow: '0 8px 24px rgba(22, 103, 255, 0.15)',
                                            border: '2px solid #f0f4ff'
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div className="step-content">
                                    <div className="step-item">
                                        <div className="step-number">3</div>
                                        <Paragraph strong style={{ color: '#333', fontSize: 16 }}>
                                            Select your <Text strong style={{ color: '#ff6b35' }}>HubSpot</Text> account and corresponding
                                            <Text strong style={{ color: '#34d399' }}> Google Drive</Text> to connect them
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8faff 0%, #e6f0ff 100%)',
            padding: '20px 0'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={1} style={{ color: '#1667ff', marginBottom: 16 }}>
                        Integration Guide
                    </Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        Follow these simple steps to connect HubSpot and Google Drive for seamless data integration
                    </Paragraph>
                </div>

                {/* Progress Steps */}
                <div style={{ marginBottom: 40 }}>
                    <Steps
                        current={currentStep}
                        onChange={goToStep}
                        items={steps.map((step, index) => ({
                            title: step.title,
                            description: step.description,
                            icon: <CheckCircleOutlined />
                        }))}
                        style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: 16,
                            boxShadow: '0 4px 20px rgba(22, 103, 255, 0.08)',
                            cursor: 'pointer'
                        }}
                    />
                </div>

                {/* Carousel */}
                <Carousel
                    ref={carouselRef}
                    arrows={false}
                    autoplay={false}
                    beforeChange={(from, to) => setCurrentStep(to)}
                    dots={{
                        className: 'custom-dots'
                    }}
                    style={{
                        background: 'white',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(22, 103, 255, 0.12)'
                    }}
                >
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div style={{ padding: '60px 40px', minHeight: '600px' }}>
                                {step.content}
                            </div>
                        </div>
                    ))}
                </Carousel>

                {/* Navigation Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 30,
                    padding: '0 20px'
                }}>
                    <Button
                        type="default"
                        size="large"
                        icon={<ArrowLeftOutlined />}
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        style={{
                            borderRadius: 12,
                            height: 48,
                            paddingLeft: 24,
                            paddingRight: 24,
                            border: currentStep === 0 ? '1px solid #d9d9d9' : '1px solid #1667ff',
                            color: currentStep === 0 ? '#d9d9d9' : '#1667ff'
                        }}
                    >
                        Previous Step
                    </Button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'white',
                        padding: '8px 16px',
                        borderRadius: 24,
                        boxShadow: '0 2px 8px rgba(22, 103, 255, 0.1)'
                    }}>
                        <span style={{ fontSize: 14, color: '#666' }}>
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={nextStep}
                        disabled={currentStep === steps.length - 1}
                        style={{
                            borderRadius: 12,
                            height: 48,
                            paddingLeft: 24,
                            paddingRight: 24,
                            background: currentStep === steps.length - 1 ? '#d9d9d9' : '#1667ff',
                            borderColor: currentStep === steps.length - 1 ? '#d9d9d9' : '#1667ff'
                        }}
                    >
                        {currentStep === steps.length - 1 ? 'Completed' : 'Next Step'}
                    </Button>
                </div>
            </div>

            <style jsx>{`
        .guide-step {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .steps-container {
          flex: 1;
        }
        
        .step-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
          border-radius: 12px;
          border: 1px solid #e6f0ff;
          transition: all 0.3s ease;
        }
        
        .step-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(22, 103, 255, 0.12);
        }
        
        .step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #1667ff, #4a90ff);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          flex-shrink: 0;
        }
        
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .image-container img {
          transition: transform 0.3s ease;
        }
        
        .image-container:hover img {
          transform: scale(1.02);
        }
        
        .custom-dots {
          bottom: 20px !important;
        }
        
        .custom-dots li button {
          background: rgba(22, 103, 255, 0.3) !important;
          border-radius: 50% !important;
          width: 12px !important;
          height: 12px !important;
        }
        
        .custom-dots li.slick-active button {
          background: #1667ff !important;
        }
        
        @media (max-width: 768px) {
          .step-item {
            flex-direction: column;
            text-align: center;
          }
          
          .step-number {
            align-self: center;
          }
        }
      `}</style>
        </div>
    );
};

export default GuidePage;