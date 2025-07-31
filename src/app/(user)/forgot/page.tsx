'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { pingMe } from '@/service/user/auth';
import Link from 'next/link';

const { Title } = Typography;

interface ForgotPasswordFormValues {
    search: string;
}

const Forgot = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

    const ping = async () => {
        const response = await pingMe();

        switch (response.status) {
            case 200:
                router.push('/home');
                break;
        }
    }

    useEffect(() => {
        ping();
    }, []);

    const handleForgotPassword = async (values: ForgotPasswordFormValues): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`https://nexce.io/wp-json/custom/v1/forget_password?search=${encodeURIComponent(values.search)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setSuccess(true);
                message.success('Check your email for password reset instructions!');
            } else {
                message.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            message.error('Something went wrong!.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // State to track current input value for icon
    const [inputValue, setInputValue] = useState<string>('');

    // Function to determine input type and get appropriate icon
    const getInputIcon = () => {
        if (!inputValue) return <UserOutlined style={{ color: '#667eea' }} />;

        // Check if it's an email
        if (inputValue.includes('@')) {
            return <MailOutlined style={{ color: '#667eea' }} />;
        }

        // Check if it's a phone number (contains only digits and some special chars)
        if (/^[\d\s\-\+\(\)]+$/.test(inputValue)) {
            return <PhoneOutlined style={{ color: '#667eea' }} />;
        }

        // Default to user icon for username
        return <UserOutlined style={{ color: '#667eea' }} />;
    };

    // Validation function for search input
    const validateSearch = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('Please enter your email, phone number, or username!'));
        }

        // Check if it's a valid email
        if (value.includes('@')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return Promise.reject(new Error('Please enter a valid email address!'));
            }
        }

        // Check if it's a valid phone number
        if (/^[\d\s\-\+\(\)]+$/.test(value)) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                return Promise.reject(new Error('Please enter a valid phone number!'));
            }
        }

        // For username, just check minimum length
        if (!value.includes('@') && !/^[\d\s\-\+\(\)]+$/.test(value)) {
            if (value.length < 3) {
                return Promise.reject(new Error('Username must be at least 3 characters!'));
            }
        }

        return Promise.resolve();
    };

    if (success) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Card
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center'
                    }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // blue-purple gradient
                        marginBottom: 24,
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    }}>
                        <MailOutlined style={{ fontSize: 32, color: '#fff' }} />
                    </div>

                    <Title
                        level={2}
                        style={{
                            color: '#2c3e50',
                            marginBottom: 16,
                            fontWeight: 600
                        }}
                    >
                        Check Your Email
                    </Title>

                    <p style={{
                        color: '#7f8c8d',
                        marginBottom: 32,
                        fontSize: '16px',
                        lineHeight: 1.6
                    }}>
                        We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
                    </p>

                    <Button
                        type="primary"
                        onClick={() => router.push('/login')}
                        style={{
                            width: '100%',
                            height: '48px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '16px',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decorative elements */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                animation: 'float 20s ease-in-out infinite',
            }} />

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .forgot-card {
                    animation: slideIn 0.6s ease-out;
                }
                
                .logo-container {
                    animation: slideIn 0.8s ease-out;
                }
            `}</style>

            <Card
                className="forgot-card"
                style={{
                    width: '100%',
                    maxWidth: 420,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Logo Section */}
                <div
                    className="logo-container"
                    style={{
                        textAlign: 'center',
                        marginBottom: 32,
                        paddingTop: 8
                    }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        marginBottom: 16,
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <img
                            src="https://nexce.io/wp-content/uploads/2025/06/cropped-cropped-NEX-3-e1750753156187.png"
                            alt="Nexce Digital"
                            style={{
                                height: 40,
                                zIndex: 2,
                                position: 'relative'
                            }}
                        />
                        {/* Floating particles effect */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 2px, transparent 2px)',
                            backgroundSize: '20px 20px',
                            animation: 'float 8s ease-in-out infinite'
                        }} />
                    </div>

                    <Title
                        level={2}
                        style={{
                            color: '#2c3e50',
                            marginBottom: 8,
                            fontWeight: 600
                        }}
                    >
                        Forgot Password
                    </Title>

                    <p style={{
                        color: '#7f8c8d',
                        margin: 0,
                        fontSize: '14px'
                    }}>
                        Enter your email, phone number, or username to receive password reset instructions
                    </p>
                </div>

                <Form<ForgotPasswordFormValues>
                    name="forgot-password-form"
                    onFinish={handleForgotPassword}
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        name="search"
                        rules={[
                            { validator: validateSearch }
                        ]}
                    >
                        <Input
                            prefix={getInputIcon()}
                            placeholder="Enter your email, phone number, or username"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            style={{
                                borderRadius: '10px',
                                border: '2px solid #e1e8ed',
                                padding: '12px 16px',
                                fontSize: '14px'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e1e8ed';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: '100%',
                                height: '48px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                            Remember your password?{' '}
                            <Link href="/login" style={{ color: '#667eea', fontWeight: 500 }}>
                                Sign In
                            </Link>
                        </span>
                    </div>
                </Form>

            </Card>
        </div>
    );
};

export default Forgot;