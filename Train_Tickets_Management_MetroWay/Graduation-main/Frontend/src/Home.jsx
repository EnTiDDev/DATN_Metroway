// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, message, Statistic } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './css/Home.css';
import AppLayout from './components/AppLayout';
import bookingIcon from './assets/booking-icon.jpg';
import ticketIcon from './assets/ticket.jpg';
import employeeIcon from './assets/employee.jpg';
import axios from "axios";
import client from './assets/client.jpg';

const { Title, Text } = Typography;

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState(null);
    const [hoten, setHoten] = useState(null);
    const [revenue, setRevenue] = useState(undefined);
    const [revenueByMonth, setRevenueByMonth] = useState(undefined);

    useEffect(() => {
        const isAdminRoute = location.pathname.startsWith('/admin');
        const storedRole = isAdminRoute ? (localStorage.getItem('admin_role') || localStorage.getItem('role')) : (localStorage.getItem('user_role') || localStorage.getItem('role'));
        const storedHoten = isAdminRoute ? (localStorage.getItem('admin_hoten') || localStorage.getItem('hoten')) : localStorage.getItem('hoten');
        const token = isAdminRoute ? (localStorage.getItem('admin_token') || localStorage.getItem('token')) : (localStorage.getItem('user_token') || localStorage.getItem('token'));

        if (!token) {
            message.error('Bạn chưa đăng nhập!');
            navigate('/');
        }

        setRole(storedRole);
        setHoten(storedHoten); // Lưu hoten để hiển thị
    }, [navigate, location.pathname]);

    // Logout moved to AppLayout header

    

    useEffect(() => {
        if (role === 'admin') {
            const getRevenue = async () => {
                try {
                    const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
                    const [summaryRes, monthlyRes] = await Promise.all([
                        axios.get('http://localhost:8081/reports/summary', { headers: { Authorization: `Bearer ${token}` } }),
                        axios.get('http://localhost:8081/reports/monthly', { headers: { Authorization: `Bearer ${token}` } })
                    ]);
                    
                    if (summaryRes.data) {
                        setRevenue(summaryRes.data.revenue || 0);
                    }
                    
                    if (monthlyRes.data && monthlyRes.data.length > 0) {
                        // Get current month's revenue
                        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
                        const currentMonthData = monthlyRes.data.find(item => item.month === currentMonth);
                        setRevenueByMonth(currentMonthData ? currentMonthData.revenue : 0);
                    }
                } catch (error) {
                    console.error(error.message);
                }
            };

            getRevenue();
        }
    }, [role]);
    
    // Function to format number as VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={3} style={{ color: '#1890ff', marginBottom: 0 }}>Trang Chủ</Title>
                <Text style={{ fontSize: '14px', color: '#555' }}>Chào mừng, <strong>{hoten}</strong> đến với hệ thống quản lý.</Text>
            </div>
            {role === 'admin' && (
                <Row gutter={16} style={{ marginBottom: 24 }} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Tổng doanh thu" value={revenue || 0} formatter={(v) => formatCurrency(v)} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title="Doanh thu theo tháng" value={revenueByMonth || 0} formatter={(v) => formatCurrency(v)} />
                        </Card>
                    </Col>
                </Row>
            )}
            <Row gutter={[24, 24]} justify="center">
                {role === 'hanhkhach' && (
                <Col xs={24} sm={12} md={8}>
                    <Card
                        hoverable
                        style={{ textAlign: 'center', height: '100%' }}
                        cover={
                            <img
                                alt="Đặt vé"
                                src={ticketIcon}
                                style={{ height: '100px', objectFit: 'contain' }}
                            />
                        }
                        onClick={() => navigate('/app/ticket-booking')}
                    >
                        <Title level={4}>Đặt vé</Title>
                        <Text>Thực hiện đặt vé nhanh chóng và tiện lợi.</Text>
                    </Card>
                </Col>)}
                <Col xs={24} sm={12} md={8}>
                    <Card
                        hoverable
                        style={{ textAlign: 'center', height: '100%' }}
                        cover={
                            <img
                                alt="Xem lịch trình"
                                src={bookingIcon}
                                style={{ height: '100px', objectFit: 'contain' }}
                            />
                        }
                        onClick={() => navigate((location.pathname.startsWith('/admin') ? '/admin' : '/app') + '/schedule')}
                    >
                        <Title level={4}>Xem lịch trình</Title>
                        <Text>Xem chi tiết lịch trình và thông tin chuyến đi.</Text>
                    </Card>
                </Col>
                {role === 'admin' && ( // Chỉ hiển thị khi vai trò là admin
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            style={{ textAlign: 'center', height: '100%' }}
                            cover={
                                <img
                                    alt="Quản lý nhân viên"
                                    src={employeeIcon}
                                    style={{ height: '100px', objectFit: 'contain' }}
                                />
                            }
                            onClick={() => navigate('/admin/manage-employee')}
                        >
                            <Title level={4}>Quản lý nhân viên</Title>
                            <Text>Chỉ dành cho quản trị viên.</Text>
                        </Card>
                    </Col>
                )}
                {(role === 'admin' || role === 'employee') && (
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            size='large'
                            hoverable
                            style={{ textAlign: 'center', height: '100%'}}
                            cover={
                                <img
                                    alt="Quản lý khách hàng"
                                    src={client}
                                    style={{ height: '100px', objectFit: 'contain' }}
                                />
                            }
                            onClick={() => navigate('/admin/client')}
                        >
                            <Title level={4}>Quản lý khách hàng</Title>
                            <Text>Tra cứu thông tin hành khách</Text>
                        </Card>
                    </Col>
                )}
                {(role === 'admin' || role === 'employee') && (
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            style={{ textAlign: 'center', height: '100%'}}
                            cover={
                                <img
                                    alt="Vé đặt"
                                    src={ticketIcon}
                                    style={{ height: '100px', objectFit: 'contain' }}
                                />
                            }
                            onClick={() => navigate('/admin/tickets')}
                        >
                            <Title level={4}>Vé đặt</Title>
                            <Text>Xem danh sách vé đã đặt</Text>
                        </Card>
                    </Col>
                )}
                {role === 'hanhkhach' && (
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            style={{ textAlign: 'center', height: '100%'}}
                            cover={
                                <img
                                    alt="Vé của tôi"
                                    src={ticketIcon}
                                    style={{ height: '100px', objectFit: 'contain' }}
                                />
                            }
                            onClick={() => navigate('/app/my-tickets')}
                        >
                            <Title level={4}>Vé của tôi</Title>
                            <Text>Xem lịch sử đặt vé của bạn</Text>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default Home;
