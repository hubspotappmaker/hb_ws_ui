'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, FormOutlined } from '@ant-design/icons';
import { loginApi, pingMe } from '@/service/user/auth';
import Link from 'next/link';

const { Title } = Typography;

interface LoginFormValues {
    email: string;
    password: string;
}

const SignIn = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const ping = async () => {
        const response = await pingMe();

        switch (response.status)
        {
            case 200:
                router.push('/administrator/manager/user');
                break;
        }
    }

    useEffect(() => {
        ping();
    }, []);

    const handleLogin = async (values: LoginFormValues): Promise<void> => {
        try
        {
            setLoading(true);
            const response = await loginApi(values.email, values.password);
            console.log('check response value: ', response);

            if (response.status === 201)
            {
                const { access_token, role, email, name } = response.data;

                localStorage.setItem('access_token', access_token);
                localStorage.setItem('role', role);
                localStorage.setItem('email', email);
                localStorage.setItem('name', name);

                if (role === 'admin')
                {
                    router.push('/administrator/manager/user');
                } else
                {
                    router.push('/403');
                }
            }
        } catch (error)
        {
            message.error('Something went wrong!.');
            console.error(error);
        } finally
        {
            setLoading(false);
        }
    };

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
                
                .login-card {
                    animation: slideIn 0.6s ease-out;
                }
                
                .logo-container {
                    animation: slideIn 0.8s ease-out;
                }
            `}</style>

            <Card
                className="login-card"
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
                        Register
                    </Title>

                    <p style={{
                        color: '#7f8c8d',
                        margin: 0,
                        fontSize: '14px'
                    }}>
                        Sign in to your admin account to continue
                    </p>
                </div>

                <Form<LoginFormValues>
                    name="login-form"
                    onFinish={handleLogin}
                    initialValues={{ remember: true }}
                    size="large"
                    layout="vertical"
                >
                      <Form.Item
                        name="Name"
                        rules={[
                            { required: true, message: 'Please enter your Name!' },
                        ]}
                    >
                        <Input
                            prefix={<FormOutlined style={{ color: '#667eea' }} />}
                            placeholder="Enter your name"
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
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#667eea' }} />}
                            placeholder="Enter your email"
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

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#667eea' }} />}
                            placeholder="Enter your password"
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
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                        Already have an account?{' '}
                            <Link href="/login" style={{ color: '#667eea', fontWeight: 500 }}>
                                Login
                            </Link>
                        </span>
                    </div>
            </Card>
        </div>
    );
};

export default SignIn;