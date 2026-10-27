// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, App as AntdApp } from 'antd';
import 'antd/dist/reset.css';
import './css/Login.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();

    // Lấy thông tin đăng nhập từ localStorage nếu có
    const initialUsername = localStorage.getItem('rememberedUsername') || '';
    const initialPassword = localStorage.getItem('rememberedPassword') || '';
    const [rememberMe, setRememberMe] = useState(Boolean(initialUsername && initialPassword));

    const onFinish = (values) => {
        setLoading(true);
        axios.post('http://localhost:8081/login', values)
            .then((res) => {
                if (res.data.success) {
                    const { token, role, hoten, maKh } = res.data;
    
                    // Lưu thông tin vào localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', role);
                    localStorage.setItem('hoten', hoten);
                    if (maKh) localStorage.setItem('maKh', String(maKh));

                    // Remember me behavior
                    if (rememberMe) {
                        localStorage.setItem('rememberedUsername', values.username);
                        localStorage.setItem('rememberedPassword', values.password);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                        localStorage.removeItem('rememberedPassword');
                    }
    
                    message.success(`Chào mừng ${hoten}, đăng nhập thành công!`);
    
                    // Điều hướng
                    if (role) {
                        // Route to user or admin area based on role
                        if (role === 'admin' || role === 'employee') {
                            localStorage.setItem('admin_token', token);
                            localStorage.setItem('admin_role', role);
                            localStorage.setItem('admin_hoten', hoten);
                            navigate('/');
                        } else {
                            localStorage.setItem('user_token', token);
                            localStorage.setItem('user_role', role);
                            navigate('/');
                        }
                    }
                } else {
                    message.error(res.data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
                }
            })
            .catch((err) => {
                const msg = err?.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!';
                message.error(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onFinishFailed = () => {
        message.error('Vui lòng kiểm tra lại thông tin!');
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <div className="login-container">
            <Title level={3}>ĐĂNG NHẬP</Title>
            <Text>Điền thông tin để tiến hành đăng nhập</Text>
            <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginTop: '20px', width: '100%' }}
                initialValues={{ username: initialUsername, password: initialPassword }}
            >
                <Form.Item
                    label="Tên Đăng Nhập/Số điện thoại/Email"
                    name="username"
                    rules={[
                        { required: true, message: 'Vui lòng nhập thông tin đăng nhập!' },
                        { min: 3, message: 'Thông tin đăng nhập phải có ít nhất 3 ký tự!' },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại hoặc email" />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Checkbox checked={rememberMe} onChange={handleRememberMeChange}>
                            Ghi nhớ đăng nhập
                        </Checkbox>
                    </div>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <Link to="/register">Đăng ký</Link>
                </div>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%' }}
                    >
                        Đăng Nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
