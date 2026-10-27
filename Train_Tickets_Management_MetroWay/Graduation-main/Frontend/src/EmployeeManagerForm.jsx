import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Switch, DatePicker, Grid, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const EmployeeForm = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng nhân viên trên mỗi trang
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/employees', { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Không thể tải dữ liệu nhân viên!');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalOpen(false);
    navigate('/admin/add-employee');
  };

  const handleEdit = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue({
      ...record,
      ngaysinh: moment(record.ngaysinh),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingEmployee) {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
        await axios.put(`http://localhost:8081/employees/${editingEmployee.id}`, {
          ...values,
          ngaysinh: values.ngaysinh.format('YYYY-MM-DD'),
        }, { headers: { Authorization: `Bearer ${token}` } });
        message.success('Cập nhật nhân viên thành công!');
      } else {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
        await axios.post('http://localhost:8081/add-employee', {
          ...values,
          ngaysinh: values.ngaysinh.format('YYYY-MM-DD'),
        }, { headers: { Authorization: `Bearer ${token}` } });
        message.success('Thêm nhân viên mới thành công!');
      }
      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      await axios.delete(`http://localhost:8081/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Xóa nhân viên thành công!');
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể xóa nhân viên!');
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current); // Cập nhật trang hiện tại
    setPageSize(pagination.pageSize); // Cập nhật số mục mỗi trang
  };

  const columns = [
    { title: 'STT', key: 'stt', width: 70, render: (_,_r,idx) => (currentPage - 1) * pageSize + idx + 1 },
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a,b) => a.id - b.id, width: 80, responsive: ['md'] },
    { title: 'Username', dataIndex: 'username', key: 'username', ellipsis: true, responsive: ['md'] },
    { title: 'Họ tên', dataIndex: 'hoten', key: 'hoten', ellipsis: true, responsive: ['md'] },
    { title: 'Ngày sinh', dataIndex: 'ngaysinh', key: 'ngaysinh', render: (date) => moment(date).format('DD/MM/YYYY'), width: 120, responsive: ['md'] },
    { title: 'Địa chỉ', dataIndex: 'diachi', key: 'diachi', ellipsis: true, responsive: ['lg'] },
    { title: 'Điện thoại', dataIndex: 'dienthoai', key: 'dienthoai', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true, responsive: ['md'] },
    { title: 'CCCD', dataIndex: 'cccd', key: 'cccd', width: 150, responsive: ['lg'] },
    {
      title: 'Quản lý',
      dataIndex: 'adminQuanLy',
      key: 'adminQuanLy',
      render: (value) => (value ? 'Có' : 'Không'),
      responsive: ['md']
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button type="text" onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredEmployees = employees.filter((e) => {
    const q = searchText.toLowerCase();
    return (
      e.hoten?.toLowerCase().includes(q) ||
      e.username?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.cccd?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm nhân viên
        </Button>
        <Input.Search
          placeholder="Tìm theo tên, username, email, CCCD"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey="id"
        bordered
        loading={!employees.length}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredEmployees.length,
          showSizeChanger: true,
          pageSizeOptions: ['5'],
        }}
        onChange={handleTableChange}
        size="small"
        expandable={isMobile ? {
          expandedRowRender: (r) => (
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: 6 }}>
              <Typography.Text strong>ID</Typography.Text><span>{r.id}</span>
              <Typography.Text strong>Username</Typography.Text><span>{r.username}</span>
              <Typography.Text strong>Họ tên</Typography.Text><span>{r.hoten}</span>
              <Typography.Text strong>Ngày sinh</Typography.Text><span>{moment(r.ngaysinh).format('DD/MM/YYYY')}</span>
              <Typography.Text strong>Địa chỉ</Typography.Text><span>{r.diachi}</span>
              <Typography.Text strong>Email</Typography.Text><span>{r.email}</span>
              <Typography.Text strong>CCCD</Typography.Text><span>{r.cccd}</span>
            </div>
          ),
          showExpandColumn: true
        } : undefined}
      />

      <Modal
        title={editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="horizontal">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập username!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng nhập password!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="hoten" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ngaysinh" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }, ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) return Promise.reject(new Error('Vui lòng chọn ngày sinh!'));
              const today = new Date();
              const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
              if (value.toDate() <= eighteenYearsAgo) return Promise.resolve();
              return Promise.reject(new Error('Nhân viên phải đủ 18 tuổi!'));
            }
          })]}> 
            <DatePicker />
          </Form.Item>
          <Form.Item name="diachi" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input placeholder="Nhập địa chỉ" autoComplete="street-address" />
          </Form.Item>
          <Form.Item name="dienthoai" label="Điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
            <Input placeholder="Nhập số điện thoại" autoComplete="tel" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cccd" label="CCCD" rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}>
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>
          <Form.Item name="adminQuanLy" label="Quản lý" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeForm;
