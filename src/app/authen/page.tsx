"use client"
import React, { useEffect, useState, CSSProperties } from 'react';
import { Button, Card, Space, Typography, Spin } from 'antd';
import { LockOutlined, SafetyOutlined, ThunderboltOutlined, RightOutlined } from '@ant-design/icons';
import { pingMe } from '@/service/user/auth';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

const SsoPage = () => {
  const [checking, setChecking] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Xử lý callback từ SSO (nếu có param `code`)
  useEffect(() => {
    const code = searchParams.get('token');
    if (code)
    {
      setRedirecting(true);
      console.log("check code: ", code);
      localStorage.setItem('access_token', code);
    }
  }, [searchParams]);

  // Kiểm tra đăng nhập nếu chưa có callback code
  useEffect(() => {
    const checkAuth = async () => {
      try
      {
        const res = await pingMe();
        if (res.status === 200)
        {
          console.log("check response: ", res);
          localStorage.setItem('role', res.data[0].role);
          localStorage.setItem('email', res.data[0].email);
          localStorage.setItem('name', res.data[0].name);
          router.push('/home/source');
        } else
        {
          setChecking(false);
        }
      } catch
      {
        setChecking(false);
      }
    };

    if (!searchParams.get('code'))
    {
      checkAuth();
    }
  }, [searchParams, router]);

  const handleAuth = () => {
    setRedirecting(true);
    window.location.href =
      'https://app.onextdigital.com/?sso=1&redirect=https:https://gdrive.onextdigital.com/connect-platform-app/application/token';
  };

  if (checking)
  {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <Spin size="large" />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.authContainer}>
      <div style={styles.backgroundPattern}></div>
      <Card style={styles.authCard} bordered={false}>
        <div style={styles.logoContainer}>
          <div style={styles.iconWrapper}>
            <LockOutlined style={styles.icon} />
          </div>
          <Title level={2} style={styles.title}>
            Welcome Back
          </Title>
          <Text style={styles.subtitle}>
            Secure authentication to access your app
          </Text>
        </div>

        <Space direction="vertical" size="middle" style={styles.featuresContainer}>
          <div style={styles.featureItem}>
            <SafetyOutlined style={styles.featureIcon} />
            <Text strong style={styles.featureText}>Secure SSO Authentication</Text>
          </div>
          <div style={styles.featureItem}>
            <ThunderboltOutlined style={styles.featureIcon} />
            <Text strong style={styles.featureText}>Quick App Access</Text>
          </div>
        </Space>

        {redirecting ? (
          <div style={styles.redirectingContainer}>
            <Spin size="large" />
            <Text style={styles.redirectingText}>Redirecting to authentication...</Text>
          </div>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={handleAuth}
            style={styles.authButton}
            className="auth-button"
          >
            Authenticate Now
            <RightOutlined style={styles.buttonIcon} />
          </Button>
        )}

        <div style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by OnextDigital App
          </Text>
        </div>
      </Card>

      <style jsx>{`
        .auth-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4) !important;
        }
        
        .auth-button:active {
          transform: translateY(0) !important;
        }
        
        .auth-button:hover .anticon {
          transform: translateX(4px);
        }
        
        @media (max-width: 768px) {
          .ant-card-body {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

// Inline styles với TypeScript typing để tránh CSS loading delay
const styles: { [key: string]: CSSProperties } = {
  authContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },

  backgroundPattern: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: 'float 20s infinite linear',
    pointerEvents: 'none'
  },

  authCard: {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 1,
    padding: '40px'
  },

  logoContainer: {
    textAlign: 'center',
    marginBottom: '32px'
  },

  iconWrapper: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  },

  icon: {
    fontSize: '36px',
    color: 'white'
  },

  title: {
    color: '#1a1a1a',
    marginBottom: '8px',
    fontSize: '28px',
    fontWeight: 600
  },

  subtitle: {
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '16px'
  },

  featuresContainer: {
    width: '100%',
    marginBottom: '32px'
  },

  featureItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '12px',
    borderLeft: '4px solid #667eea',
    transition: 'all 0.3s ease'
  },

  featureIcon: {
    fontSize: '20px',
    color: '#667eea',
    marginRight: '12px'
  },

  featureText: {
    color: '#1a1a1a',
    fontSize: '14px'
  },

  authButton: {
    width: '100%',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease'
  },

  buttonIcon: {
    marginLeft: '8px',
    transition: 'transform 0.3s ease'
  },

  footer: {
    textAlign: 'center',
    marginTop: '24px'
  },

  footerText: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: '14px'
  },

  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },

  loadingContent: {
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(20px)'
  },

  loadingText: {
    marginTop: '16px',
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '16px'
  },

  redirectingContainer: {
    textAlign: 'center',
    padding: '20px 0'
  },

  redirectingText: {
    marginTop: '16px',
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '16px'
  }
};

export default SsoPage;