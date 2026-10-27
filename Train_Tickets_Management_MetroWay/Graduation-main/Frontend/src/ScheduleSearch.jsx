// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Table, Typography, Row, Col, message, Card, Space, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const ScheduleSearch = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState([]);
    const [stations, setStations] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Fetch stations from API
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axios.get('http://localhost:8081/schedules/stations');
                if (response.data && response.data.length > 0) {
                    setStations(response.data.map(item => ({ value: item.station, label: item.station })));
                }
            } catch (error) {
                console.error('Error fetching stations:', error);
                // Fallback to hardcoded stations if API fails
                setStations([
                    { value: 'Hà Nội', label: 'Hà Nội' },
                    { value: 'Hải Dương', label: 'Hải Dương' },
                    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
                    { value: 'TP. HCM', label: 'TP. HCM' }
                ]);
            }
        };
        fetchStations();
    }, []);

    const columns = [
        { title: 'Mã', dataIndex: 'key', key: 'key', width: 100 },
        { title: 'Ga đi', dataIndex: 'departure', key: 'departure' },
        { title: 'Ga đến', dataIndex: 'arrival', key: 'arrival' },
        { title: 'Ngày đi', dataIndex: 'departureTime', key: 'departureTime', width: 140, responsive: ['md'] },
        { title: 'Giờ đi', dataIndex: 'time', key: 'time', width: 100 },
        { title: 'Ngày đến', dataIndex: 'arrivalTime', key: 'arrivalTime', width: 140, responsive: ['md'] },
        { title: 'Giá', dataIndex: 'price', key: 'price', width: 120, responsive: ['md'] },
        { title: 'Tàu', dataIndex: 'train', key: 'train', responsive: ['lg'] },
    ];

    useEffect(() => {
        if (allData.length > 0) {
            return;
        }   

        const fetchSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:8081/schedules');
                if (response.data && response.data.length > 0) {
                    setAllData(
                        response.data.map(item => ({
                            key: item.MaLichTrinh,
                            departure: item.GaDi,
                            arrival: item.GaDen,
                            departureTime: moment(item.NgayDi).format('YYYY-MM-DD'),
                            time: item.GioDi,
                            arrivalTime: moment(item.NgayDen).format('YYYY-MM-DD'),
                            price: item.DonGia,
                            train: item.TenTau
                        }))
                    );
                }
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, [allData]);

    // Prefill from query params (coming from Landing search)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const from = params.get('from');
        const to = params.get('to');
        if (from && to) {
            form.setFieldsValue({ from, to });
            handleSearch({ from, to });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async (values) => {
        setLoading(true); // Show loading state
        try {
            // Replace with your API endpoint
            const response = await axios.get('http://localhost:8081/schedules/search', {
                params: {
                    from: values.from,
                    to: values.to,
                },
            });

            if (response.data && response.data.length > 0) {
                setData(
                    response.data.map(item => ({
                        key: item.MaLichTrinh,
                        departure: item.GaDi,
                        arrival: item.GaDen,
                        departureTime: moment(item.NgayDi).format('YYYY-MM-DD'),
                        time: item.GioDi,
                        arrivalTime: moment(item.NgayDen).format('YYYY-MM-DD'),
                        price: item.DonGia,
                        train: item.TenTau
                    }))
                );
                message.success('Tìm thấy lịch trình phù hợp!');
            } else {
                setData([]);
                message.info('Không tìm thấy lịch trình phù hợp!');
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            message.error('Đã xảy ra lỗi khi tải lịch trình!');
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    const resultData = data.length > 0 ? data : allData;

    return (
        <div style={{ padding: '8px' }}>
            <Row justify="center">
                <Col xs={24} md={22} lg={18} xl={16}>
                    <Title level={4} style={{ textAlign: 'center', marginBottom: '16px' }}>
                        TRA CỨU LỊCH TRÌNH
                    </Title>
                    <Card style={{ marginBottom: 16, boxShadow: '0 10px 28px rgba(0,0,0,0.08)', borderRadius: 12 }}>
                        <Form form={form} layout="vertical" onFinish={handleSearch}>
                            <Row gutter={[12, 8]}>
                                <Col xs={24} md={8}>
                                    <Form.Item name="from" label="Ga đi" rules={[{ required: true, message: 'Vui lòng chọn nơi đi!' }]}>
                                        <Select placeholder="Chọn ga đi" allowClear>
                                            {stations.map(station => (
                                                <Option key={station.value} value={station.value}>
                                                    {station.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="to" label="Ga đến" rules={[{ required: true, message: 'Vui lòng chọn nơi đến!' }]}>
                                        <Select placeholder="Chọn ga đến" allowClear>
                                            {stations.map(station => (
                                                <Option key={station.value} value={station.value}>
                                                    {station.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="date" label="Ngày đi (tùy chọn)">
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Space wrap>
                                <Button type="primary" htmlType="submit" loading={loading}>Tìm kiếm</Button>
                                <Button onClick={() => form.resetFields()}>Xóa</Button>
                                <Button onClick={() => navigate('/app/home')}>Quay lại trang chủ</Button>
                            </Space>
                        </Form>
                    </Card>

                    <div style={{ marginBottom: 8 }}>
                        <Typography.Text>Kết quả: {resultData.length} chuyến</Typography.Text>
                    </div>
                    <Table
                        dataSource={resultData}
                        columns={columns}
                        bordered
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        size="small"
                        scroll={{ x: true }}
                        expandable={{
                          expandedRowRender: (r) => (
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 6 }}>
                              <Typography.Text strong>Mã</Typography.Text><span>{r.key}</span>
                              <Typography.Text strong>Ga đi</Typography.Text><span>{r.departure}</span>
                              <Typography.Text strong>Ga đến</Typography.Text><span>{r.arrival}</span>
                              <Typography.Text strong>Ngày đi</Typography.Text><span>{r.departureTime}</span>
                              <Typography.Text strong>Giờ đi</Typography.Text><span>{r.time}</span>
                              <Typography.Text strong>Ngày đến</Typography.Text><span>{r.arrivalTime}</span>
                              <Typography.Text strong>Giá</Typography.Text><span>{r.price}</span>
                              <Typography.Text strong>Tàu</Typography.Text><span>{r.train}</span>
                            </div>
                          )
                        }}
                        style={{ background: '#fff' }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ScheduleSearch;
