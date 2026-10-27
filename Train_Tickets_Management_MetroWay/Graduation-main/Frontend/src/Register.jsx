import React, { useState } from 'react';
import { Form, Input, Button, Typography, DatePicker, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Register.css';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                ngaysinh: values.ngaysinh ? values.ngaysinh.format('YYYY-MM-DD') : undefined,
            };
            const res = await axios.post('http://localhost:8081/register', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.data?.success) {
                message.success('Đăng ký thành công!');
                navigate('/');
            } else {
                message.error(res.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.');
            }
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký!';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = () => {
        message.error('Vui lòng kiểm tra lại thông tin!');
    };

    return (
        <div className="register-container">
            <Title level={3}>ĐĂNG KÝ</Title>
            <Text>Điền thông tin để tạo tài khoản</Text>
            <Form
                name="register"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ marginTop: '20px', width: '100%' }}
            >
                <div className="form-columns">
                    <div className="form-column">
                       <Form.Item
                            label="Họ tên"
                            name="hoten"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input placeholder="Nhập họ tên" />
                        </Form.Item>

                        <Form.Item
                            label="Ngày sinh"
                            name="ngaysinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="diachi"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>
                    </div>

                    <div className="form-column">
                        <Form.Item
                            label="Số điện thoại"
                            name="dienthoai"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^\d{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        
                        <Form.Item
                            label="CCCD"
                            name="cccd"
                            rules={[
                                { required: true, message: 'Vui lòng nhập đúng CCCD!' },
                                { min: 12, message: 'CCCD phải có ít nhất 12 số!' },
                            ]}
                        >
                            <Input placeholder="Nhập CCCD" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Mật khẩu xác nhận không khớp!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                    </div>
                </div>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        Đăng Ký
                    </Button>
                    <Button
                        type="default"
                        style={{ width: '100%' }}
                        onClick={() => navigate('/')}
                    >
                        Quay lại
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register;
