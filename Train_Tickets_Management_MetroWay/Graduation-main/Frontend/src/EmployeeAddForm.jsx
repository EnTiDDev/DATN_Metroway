// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Form, Input, Button, DatePicker, Row, Col, message, Switch, Grid } from 'antd';
import 'antd/dist/reset.css';
import { useNavigate } from 'react-router-dom';
import './css/EmployeeForm.css';
import axios from 'axios';

const EmployeeAddForm = () => {
    const [form] = Form.useForm();
    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const token = localStorage.getItem('user_token') || localStorage.getItem('token');
            const normalizedPhone = String(values.dienthoai || '').replace(/^\+84/, '0');
            const response = await axios.post('http://localhost:8081/add-employee', { ...values, dienthoai: normalizedPhone }, { headers: { Authorization: `Bearer ${token}` } });
    
            if (response.data.success) {
                message.success(response.data.message || 'Nhân viên đã được thêm thành công!');
                form.resetFields();
                navigate('/admin/manage-employee');
            } else {
                message.error(response.data.message || 'Đã xảy ra lỗi khi thêm nhân viên!');
            }
        } catch (error) {
            const detail = error?.response?.data;
            const errors = detail?.errors;
            if (errors && typeof errors === 'object') {
              const fields = Object.entries(errors).map(([name, msg]) => ({ name, errors: [msg] }));
              form.setFields(fields);
              message.error(detail?.message || 'Dữ liệu không hợp lệ');
            } else if (error?.response?.status === 409) {
              // Map common unique errors heuristically for employees
              const msg = String(detail?.message || '').toLowerCase();
              const fields = [];
              if (msg.includes('email')) fields.push({ name:'email', errors:['Email đã tồn tại'] });
              if (msg.includes('phone') || msg.includes('điện thoại') || msg.includes('dienthoai')) fields.push({ name:'dienthoai', errors:['Số điện thoại đã tồn tại'] });
              if (fields.length) form.setFields(fields);
              message.error('Trùng dữ liệu');
            } else {
              message.error(detail?.message || 'Không thể kết nối đến server. Vui lòng thử lại!');
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Validation Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại các trường thông tin!');
    };

    const handleCancel = () => {
        navigate('/admin/manage-employee'); 
    };


    return (
        <div className="employee-form-container">
            <h1>Thêm nhân viên</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="employee-addform"
            >
                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Họ tên"
                            name="hoten"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input placeholder="Nhập họ tên" autoComplete="name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Số CCCD"
                            name="cccd"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số CCCD!' },
                                { pattern: /^\d{9,12}$/, message: 'Số CCCD không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Nhập số CCCD" autoComplete="off" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="ngaysinh"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày sinh!' },
                                () => ({
                                    validator(_, value) {
                                        if (!value) {
                                            return Promise.reject(new Error('Ngày sinh không được để trống!'));
                                        }
                                        const today = new Date();
                                        const eighteenYearsAgo = new Date(
                                            today.getFullYear() - 18,
                                            today.getMonth(),
                                            today.getDate()
                                        );
                                        if (value.isBefore(eighteenYearsAgo)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Nhân viên phải đủ 18 tuổi!'));
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                placeholder="Chọn ngày sinh"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="dienthoai"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^(\+84|0)\d{9,10}$/, message: 'Số điện thoại không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" autoComplete="tel" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="diachi"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input placeholder="Nhập địa chỉ" autoComplete="street-address" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập username!' },
                                { min: 4, message: 'Username phải có ít nhất 4 ký tự!' },
                            ]}
                        >
                            <Input placeholder="Nhập username" autoComplete="username" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input placeholder="Nhập email" autoComplete="email" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" autoComplete="new-password" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Quản lý" name="adminQuanLy" valuePropName="checked">
                        <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <div className="form-buttons">
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={handleCancel}
                            style={{ marginLeft: '10px' }}
                        >
                            Hủy
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EmployeeAddForm;
