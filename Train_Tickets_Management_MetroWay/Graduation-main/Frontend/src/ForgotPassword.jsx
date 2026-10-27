import { useState } from 'react';
import { Form, Input, Button, Typography, notification } from 'antd';
import 'antd/dist/reset.css'; // Ant Design styles
import './css/ForgotPassword.css'; // Custom styles
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = () => {
        setLoading(true);

        // Giả lập API để gửi liên kết đặt lại mật khẩu
        setTimeout(() => {
            notification.success({
                message: 'Liên kết đặt lại mật khẩu',
                description: 'Đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra!',
                duration: 3, // Thời gian hiển thị thông báo
            });
            setLoading(false);
            navigate('/'); // Quay lại trang đăng nhập sau khi thành công
        }, 2000);
    };

    const onFinishFailed = () => {
        notification.error({
            message: 'Lỗi xác thực',
            description: 'Vui lòng kiểm tra thông tin và thử lại!',
            duration: 3, // Thời gian hiển thị thông báo
        });
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <Title level={2} className="forgot-password-title">
                    Quên Mật Khẩu
                </Title>
                <Text className="forgot-password-text">
                    Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                </Text>
                <Form
                    name="forgot-password"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="forgot-password-form"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Vui lòng nhập một email hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="forgot-password-submit-button"
                        >
                            Gửi Liên Kết
                        </Button>
                    </Form.Item>
                </Form>
                <div className="back-to-login">
                    <Button type="link" onClick={() => navigate('/')}>
                        Quay lại trang đăng nhập
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
