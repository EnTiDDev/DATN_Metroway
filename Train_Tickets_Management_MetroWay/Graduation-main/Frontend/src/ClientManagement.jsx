import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, DatePicker, Grid, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClients, setEditingClients] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hành khách trên mỗi trang
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/clients', { headers: { Authorization: `Bearer ${token}` } });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error('Không thể tải dữ liệu hành khách!');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAdd = () => {
    setEditingClients(null);
    form.resetFields();
    setIsModalOpen(false);
    navigate('/admin/add-client');
  };

  const handleEdit = (record) => {
    setEditingClients(record);
    console.log(record);
    form.setFieldsValue({
      ...record,
      ngaysinh: moment(record.ngaysinh),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      if (editingClients) {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
        await axios.put(`http://localhost:8081/clients/${editingClients.MaKH}`, {
          ...values,
          ngaysinh: values.ngaysinh.format('YYYY-MM-DD'),
        }, { headers: { Authorization: `Bearer ${token}` } });
        message.success('Cập nhật hành khách thành công!');
      } else {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
        await axios.post('http://localhost:8081/add-client', {
          ...values,
          ngaysinh: values.ngaysinh.format('YYYY-MM-DD'),
        }, { headers: { Authorization: `Bearer ${token}` } });
        message.success('Thêm hành khách mới thành công!');
      }
      fetchClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Xóa hành khách thành công!');
      fetchClients();
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể xóa hành khách!');
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current); // Cập nhật trang hiện tại
    setPageSize(pagination.pageSize); // Cập nhật số mục mỗi trang
  };

  const columns = [
    { title: 'STT', key: 'stt', width: 70, render: (_,_r,idx) => (currentPage - 1) * pageSize + idx + 1 },
    { title: 'Mã khách hàng', dataIndex: 'MaKH', key: 'MaKH', width: 120, responsive: ['md'] },
    { title: 'CCCD', dataIndex: 'CCCD', key: 'CCCD', width: 160, responsive: ['lg'] },
    { title: 'Họ tên', dataIndex: 'HoTen', key: 'HoTen', ellipsis: true, responsive: ['md'] },
    { title: 'Ngày sinh', dataIndex: 'ngaysinh', key: 'ngaysinh', render: (date) => moment(date).format('DD/MM/YYYY'), width: 120, responsive: ['md'] },
    { title: 'Địa chỉ', dataIndex: 'DiaChi', key: 'DiaChi', ellipsis: true, responsive: ['lg'] },
    { title: 'Điện thoại', dataIndex: 'DienThoai', key: 'DienThoai', width: 120 },
    { title: 'Email', dataIndex: 'Email', key: 'Email', ellipsis: true, responsive: ['md'] },
    {
      title: 'Hành động',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button type="text" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hành khách này?"
            onConfirm={() => handleDelete(record.MaKH)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredClients = clients.filter((c) => {
    const q = searchText.toLowerCase();
    return (
      c.HoTen?.toLowerCase().includes(q) ||
      c.Email?.toLowerCase().includes(q) ||
      c.CCCD?.toLowerCase().includes(q) ||
      c.DienThoai?.toLowerCase().includes(q)
    );
  });

    return (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Button type="primary" onClick={handleAdd}>
              Thêm hành khách
            </Button>
            <Input.Search
              placeholder="Tìm theo tên, email, CCCD, điện thoại"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: 360 }}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredClients}
            rowKey="MaKH"
            bordered
            loading={!clients.length}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredClients.length,
              showSizeChanger: true,
              pageSizeOptions: ['5'],
            }}
            onChange={handleTableChange}
            size="small"
            expandable={isMobile ? {
              expandedRowRender: (r) => (
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 6 }}>
                  <Typography.Text strong>Mã KH</Typography.Text><span>{r.MaKH}</span>
                  <Typography.Text strong>Họ tên</Typography.Text><span>{r.HoTen}</span>
                  <Typography.Text strong>CCCD</Typography.Text><span>{r.CCCD}</span>
                  <Typography.Text strong>Ngày sinh</Typography.Text><span>{moment(r.ngaysinh).format('DD/MM/YYYY')}</span>
                  <Typography.Text strong>Địa chỉ</Typography.Text><span>{r.DiaChi}</span>
                  <Typography.Text strong>Email</Typography.Text><span>{r.Email}</span>
                </div>
              ),
              showExpandColumn: true
            } : undefined}
          />
    
          <Modal
            title={editingClients ? 'Sửa hành khách' : 'Thêm hành khách'}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSave}
          >
            <Form form={form} layout="horizontal">
              <Form.Item name="MaKH" label="Mã khách hàng">
                <Input disabled />
              </Form.Item>
              <Form.Item name="CCCD" label="CCCD" rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}>
                <Input placeholder="Nhập số CCCD" />
              </Form.Item>
              <Form.Item name="HoTen" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="ngaysinh" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name="DiaChi" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                <Input placeholder="Nhập địa chỉ" autoComplete="street-address" />
              </Form.Item>
              <Form.Item name="DienThoai" label="Điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder="Nhập số điện thoại" autoComplete="tel" />
              </Form.Item>
              <Form.Item name="Email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      );
};

export default ClientManagement;