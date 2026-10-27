// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Tabs, Empty, Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { catalogService } from '../services/catalogService';

const useCrud = (listFn, createFn, updateFn, deleteFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await listFn();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); form.resetFields(); setOpen(true); };
  const onEdit = (record) => { setEditing(record); form.setFieldsValue(record); setOpen(true); };
  const onRemove = async (id) => { await deleteFn(id); message.success('Đã xóa'); load(); };
  const onOk = async () => {
    const values = await form.validateFields();
    if (editing) { await updateFn(editing.id, values); message.success('Đã cập nhật'); }
    else { await createFn(values); message.success('Đã tạo'); }
    setOpen(false); load();
  };

  return { data, loading, open, setOpen, form, onAdd, onEdit, onRemove, onOk };
};

const Catalog = () => {
  const trains = useCrud(catalogService.listTrains, catalogService.createTrain, catalogService.updateTrain, catalogService.deleteTrain);
  const carriages = useCrud(catalogService.listCarriages, catalogService.createCarriage, catalogService.updateCarriage, catalogService.deleteCarriage);
  const seats = useCrud(catalogService.listSeats, catalogService.createSeat, catalogService.updateSeat, catalogService.deleteSeat);
  const routes = useCrud(catalogService.listRoutes, catalogService.createRoute, catalogService.updateRoute, catalogService.deleteRoute);
  const prices = useCrud(catalogService.listPrices, catalogService.createPrice, catalogService.updatePrice, catalogService.deletePrice);

  const columns = {
    trains: [
      { title: 'Mã tàu', dataIndex: 'code', key: 'code' },
      { title: 'Tên', dataIndex: 'name', key: 'name' },
      { title: 'Thao tác', key: 'action', render: (_, r) => (<Space><Button type="link" onClick={() => trains.onEdit(r)}>Sửa</Button><Button danger type="link" onClick={() => trains.onRemove(r.id)}>Xóa</Button></Space>) },
    ],
    carriages: [
      { title: 'Mã tàu', dataIndex: 'trainCode', key: 'trainCode' },
      { title: 'Số toa', dataIndex: 'number', key: 'number' },
      { title: 'Loại', dataIndex: 'type', key: 'type' },
      { title: 'Thao tác', key: 'action', render: (_, r) => (<Space><Button type="link" onClick={() => carriages.onEdit(r)}>Sửa</Button><Button danger type="link" onClick={() => carriages.onRemove(r.id)}>Xóa</Button></Space>) },
    ],
    seats: [
      { title: 'Toa', dataIndex: 'carriage', key: 'carriage' },
      { title: 'Ghế', dataIndex: 'code', key: 'code' },
      { title: 'Hạng', dataIndex: 'class', key: 'class' },
      { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
      { title: 'Thao tác', key: 'action', render: (_, r) => (<Space><Button type="link" onClick={() => seats.onEdit(r)}>Sửa</Button><Button danger type="link" onClick={() => seats.onRemove(r.id)}>Xóa</Button></Space>) },
    ],
    routes: [
      { title: 'Mã', dataIndex: 'code', key: 'code' },
      { title: 'Từ', dataIndex: 'from', key: 'from' },
      { title: 'Đến', dataIndex: 'to', key: 'to' },
      { title: 'Km', dataIndex: 'distance', key: 'distance' },
      { title: 'Thao tác', key: 'action', render: (_, r) => (<Space><Button type="link" onClick={() => routes.onEdit(r)}>Sửa</Button><Button danger type="link" onClick={() => routes.onRemove(r.id)}>Xóa</Button></Space>) },
    ],
    prices: [
      { title: 'Tuyến', dataIndex: 'routeCode', key: 'routeCode' },
      { title: 'Hạng', dataIndex: 'class', key: 'class' },
      { title: 'Giá (VND)', dataIndex: 'amount', key: 'amount' },
      { title: 'Thao tác', key: 'action', render: (_, r) => (<Space><Button type="link" onClick={() => prices.onEdit(r)}>Sửa</Button><Button danger type="link" onClick={() => prices.onRemove(r.id)}>Xóa</Button></Space>) },
    ],
  };

  const renderCrud = (title, hook, fields) => (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={hook.onAdd}>Thêm {title}</Button>
      </Space>
      <Table rowKey="id" dataSource={hook.data} loading={hook.loading} columns={columns[fields]} />
      <Modal
        title={hook.editing ? `Sửa ${title}` : `Thêm ${title}`}
        open={hook.open}
        onCancel={() => hook.setOpen(false)}
        onOk={hook.onOk}
      >
        <Form form={hook.form} layout="vertical">
          {fields === 'trains' && (
            <>
              <Form.Item name="code" label="Mã tàu" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
            </>
          )}
          {fields === 'carriages' && (
            <>
              <Form.Item name="trainCode" label="Mã tàu" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="number" label="Số toa" rules={[{ required: true }]}><Input type="number" /></Form.Item>
              <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                <Select options={[{ value: 'Giường nằm' }, { value: 'Ghế mềm' }, { value: 'Ghế cứng' }]} />
              </Form.Item>
            </>
          )}
          {fields === 'seats' && (
            <>
              <Form.Item name="carriage" label="Toa" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="code" label="Ghế" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="class" label="Hạng" rules={[{ required: true }]}>
                <Select options={[{ value: 'Phổ thông' }, { value: 'Thương gia' }]} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={[{ value: 'available', label: 'Còn trống' }, { value: 'maintenance', label: 'Bảo trì' }]} />
              </Form.Item>
            </>
          )}
          {fields === 'routes' && (
            <>
              <Form.Item name="code" label="Mã tuyến" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="from" label="Từ" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="to" label="Đến" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="distance" label="Km" rules={[{ required: true }]}><Input type="number" /></Form.Item>
            </>
          )}
          {fields === 'prices' && (
            <>
              <Form.Item name="routeCode" label="Tuyến" rules={[{ required: true }]}><Input /></Form.Item>
              <Form.Item name="class" label="Hạng" rules={[{ required: true }]}>
                <Select options={[{ value: 'Phổ thông' }, { value: 'Thương gia' }]} />
              </Form.Item>
              <Form.Item name="amount" label="Giá (VND)" rules={[{ required: true }]}><Input type="number" /></Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );

  return (
    <Tabs
      items={[
        { key: 'trains', label: 'Đoàn tàu', children: renderCrud('đoàn tàu', trains, 'trains') },
        { key: 'carriages', label: 'Toa tàu', children: renderCrud('toa tàu', carriages, 'carriages') },
        { key: 'seats', label: 'Ghế', children: renderCrud('ghế', seats, 'seats') },
        { key: 'routes', label: 'Lịch trình', children: renderCrud('lịch trình', routes, 'routes') },
        { key: 'prices', label: 'Bảng giá', children: renderCrud('bảng giá', prices, 'prices') },
      ]}
    />
  );
};

export default Catalog;


