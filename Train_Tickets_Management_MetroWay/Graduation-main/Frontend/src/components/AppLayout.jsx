import React, { useMemo, useState } from 'react';
import { Layout, Menu, Space, Typography, Button, Breadcrumb, Grid } from 'antd';
import { 
  HomeOutlined, 
  ScheduleOutlined, 
  CreditCardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  SettingOutlined, 
  LogoutOutlined 
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const routeItemsByRole = (role) => {
  const base = [
    { key: '/home', label: 'Trang chủ', icon: <HomeOutlined /> },
    { key: '/schedule', label: 'Lịch trình', icon: <ScheduleOutlined /> },
  ];

  if (role === 'hanhkhach') {
    return [
      ...base,
      { key: '/ticket-booking', label: 'Đặt vé', icon: <CreditCardOutlined /> },
      { key: '/my-tickets', label: 'Vé của tôi', icon: <FileTextOutlined /> },
    ];
  }

  if (role === 'admin' || role === 'employee') {
    return [
      ...base,
      ...(role === 'admin' ? [{ key: '/admin/manage-employee', label: 'Nhân viên', icon: <TeamOutlined /> }] : []),
      { key: '/client', label: 'Khách hàng', icon: <UserOutlined /> },
      { key: '/admin/tickets', label: 'Vé đặt', icon: <FileTextOutlined /> },
    ];
  }

  if (role === 'employee') {
    return [
      ...base,
      { key: '/client', label: 'Khách hàng', icon: <UserOutlined /> },
    ];
  }

  return base;
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const role = localStorage.getItem(isAdminRoute ? 'admin_role' : 'user_role') || localStorage.getItem('role');
  const hoten = localStorage.getItem(isAdminRoute ? 'admin_hoten' : 'hoten');

  const menuItems = useMemo(() => {
    const items = routeItemsByRole(role);
    if (role === 'admin') {
      items.push({ key: '/reports', label: 'Báo cáo', icon: <FileTextOutlined /> });
      items.push({ key: '/catalog', label: 'Danh mục', icon: <SettingOutlined /> });
    }
    // Prefix keys to match current namespace so selectedKeys work and show highlight
    const prefix = isAdminRoute ? '/admin' : '/app';
    return items.map(item => (
      item.key.startsWith('/admin') || item.key.startsWith('/app')
        ? item
        : { ...item, key: `${prefix}${item.key}` }
    ));
  }, [role, isAdminRoute]);

  const onMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    // Clear all possible auth/user/admin keys to ensure UI reflects logged-out state
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('hoten');
    localStorage.removeItem('maKh');
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_hoten');
    navigate('/');
  };

  const breadcrumbItems = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const items = [
      { title: 'Trang chủ', path: isAdminRoute ? '/admin/home' : '/app/home' },
      ...segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        const titleMap = {
          home: 'Trang chủ',
          schedule: 'Lịch trình',
          'ticket-booking': 'Đặt vé',
          'manage-employee': 'Nhân viên',
          'add-employee': 'Thêm nhân viên',
          client: 'Khách hàng',
          'add-client': 'Thêm khách hàng',
          'forgot-password': 'Quên mật khẩu',
          reports: 'Báo cáo',
          catalog: 'Danh mục',
          'my-tickets': 'Vé của tôi',
        };
        return { title: titleMap[seg] || seg, path };
      })
    ];
    return items;
  }, [location.pathname, isAdminRoute]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Responsive Sidebar - Always visible */}
      <Sider
        breakpoint="lg"
        collapsedWidth={64}
        theme="dark"
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh',
          overflow: 'auto'
        }}
        width={screens.lg ? 200 : 72}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#fff', 
          fontWeight: 700, 
          letterSpacing: .5,
          fontSize: screens.lg ? '16px' : '14px',
          padding: '0 8px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          TICKET APP
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems.map(item => ({ 
              key: item.key, 
              label: item.label, 
              icon: item.icon 
            }))}
            onClick={onMenuClick}
            style={{
              borderRight: 0,
              flex: 1
            }}
          />
          {/* Logout button at bottom of sidebar */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                width: '100%',
                height: '40px',
                fontWeight: 600,
                fontSize: screens.lg ? '14px' : '12px'
              }}
              title={isAdminRoute ? 'Thoát quản trị' : 'Thoát'}
            />
          </div>
        </div>
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: screens.lg ? '0 16px' : '0 8px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 9 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space direction="horizontal" size={screens.lg ? 16 : 8}>
              <Text strong style={{ fontSize: screens.lg ? 16 : 14 }}>Hệ thống quản lý vé tàu</Text>
              {screens.lg && (
                <Breadcrumb items={breadcrumbItems.map(b => ({ title: b.title, href: b.path }))} />
              )}
            </Space>
            <Space size={screens.lg ? 16 : 8}>
              {hoten && (
                <Text style={{ fontSize: screens.lg ? 14 : 12 }}>
                  Xin chào, <strong>{hoten}</strong>
                </Text>
              )}
            </Space>
          </div>
        </Header>
        <Content style={{ margin: screens.lg ? '16px' : '8px' }}>
          <div style={{ 
            padding: screens.lg ? 16 : 12, 
            background: '#fff', 
            borderRadius: 10, 
            boxShadow: '0 6px 16px rgba(0,0,0,0.06)' 
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;


