// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, message, Grid, Typography, Popconfirm } from 'antd';
import { PrinterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminTickets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const [ticketsRes, schedulesRes] = await Promise.all([
        axios.get('http://localhost:8081/admin/tickets', auth),
        axios.get('http://localhost:8081/schedules')
      ]);
      const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];
      const schedules = schedulesRes.data || [];
      const byId = new Map(schedules.map(s => [s.MaLichTrinh, s]));
      const enriched = tickets.map(t => {
        const sch = byId.get(t.LichTrinh) || {};
        return { ...t,
          GaDi: t.GaDi ?? sch.GaDi,
          GaDen: t.GaDen ?? sch.GaDen,
          TenTau: t.TenTau ?? sch.TenTau,
          NgayDen: t.NgayDen ?? sch.NgayDen,
        };
      });
      setData(enriched);
    } catch (e2) {
      console.error('Tickets load error:', e2?.response?.data || e2?.message);
      message.error('Không thể tải danh sách vé đặt');
    } finally {
      setLoading(false);
    }
  };

  const cancelTicket = async (id) => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:8081/admin/tickets/${id}`, auth);
      
      // Tìm thông tin vé để hiển thị thông báo chi tiết
      const ticket = data.find(t => t.MaVe === id);
      const paymentMethod = ticket?.PhuongThucThanhToan;
      const customerName = ticket?.HoTen;
      
      let messageText = `Đã hủy vé ${id} của khách hàng ${customerName}`;
      if (paymentMethod?.toUpperCase() === 'VNPAY') {
        messageText += ' (Thanh toán VNPAY)';
      }
      
      message.success(messageText);
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Không thể hủy vé');
    }
  };

  const printTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    const ticketHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vé tàu - ${ticket.MaVe}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: white;
            color: black;
          }
          .ticket {
            border: 2px solid #000;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .ticket-type {
            font-size: 18px;
            color: #333;
          }
          .ticket-info {
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .label {
            font-weight: bold;
            min-width: 120px;
          }
          .value {
            text-align: right;
            flex: 1;
          }
          .route {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border: 1px solid #ddd;
          }
          .price {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #d32f2f;
            margin: 15px 0;
            padding: 10px;
            background: #fff3e0;
            border: 1px solid #ff9800;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #000;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .ticket { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="company-name">CÔNG TY ĐƯỜNG SẮT VIỆT NAM</div>
            <div class="ticket-type">VÉ TÀU HÀNH KHÁCH</div>
          </div>
          
          <div class="ticket-info">
            <div class="info-row">
              <span class="label">Mã vé:</span>
              <span class="value">${ticket.MaVe}</span>
            </div>
            <div class="info-row">
              <span class="label">Khách hàng:</span>
              <span class="value">${ticket.HoTen || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">CCCD:</span>
              <span class="value">${ticket.CCCD || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ngày đặt:</span>
              <span class="value">${ticket.NgayDat ? new Date(ticket.NgayDat).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Tàu:</span>
              <span class="value">${ticket.TenTau || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Toa:</span>
              <span class="value">${ticket.Toa || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ghế:</span>
              <span class="value">${ticket.SoGhe || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Hạng ghế:</span>
              <span class="value">${ticket.HangGhe || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Loại vé:</span>
              <span class="value">${ticket.LoaiVe || '-'}</span>
            </div>
          </div>
          
          <div class="route">
            ${ticket.GaDi || ''} → ${ticket.GaDen || ''}
          </div>
          
          <div class="ticket-info">
            <div class="info-row">
              <span class="label">Ngày đi:</span>
              <span class="value">${ticket.NgayDi ? new Date(ticket.NgayDi).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Giờ đi:</span>
              <span class="value">${ticket.GioDi || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ngày đến:</span>
              <span class="value">${ticket.NgayDen ? new Date(ticket.NgayDen).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Thanh toán:</span>
              <span class="value">${ticket.PhuongThucThanhToan || '-'}</span>
            </div>
          </div>
          
          <div class="price">
            Giá vé: ${ticket.DonGia ? ticket.DonGia.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          
          <div class="footer">
            <p>Vui lòng giữ vé này trong suốt hành trình</p>
            <p>Vé có hiệu lực từ ngày ${ticket.NgayDi ? new Date(ticket.NgayDi).toLocaleDateString('vi-VN') : '-'}</p>
            <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
            <p>In bởi: Admin</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(ticketHtml);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after content loads
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };

  const printMultipleTickets = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một vé để in');
      return;
    }

    const selectedTickets = data.filter(ticket => selectedRowKeys.includes(ticket.MaVe));
    const printWindow = window.open('', '_blank');
    
    let allTicketsHtml = '';
    selectedTickets.forEach((ticket, index) => {
      const ticketHtml = `
        <div class="ticket" style="page-break-after: ${index < selectedTickets.length - 1 ? 'always' : 'avoid'};">
          <div class="header">
            <div class="company-name">CÔNG TY ĐƯỜNG SẮT VIỆT NAM</div>
            <div class="ticket-type">VÉ TÀU HÀNH KHÁCH</div>
          </div>
          
          <div class="ticket-info">
            <div class="info-row">
              <span class="label">Mã vé:</span>
              <span class="value">${ticket.MaVe}</span>
            </div>
            <div class="info-row">
              <span class="label">Khách hàng:</span>
              <span class="value">${ticket.HoTen || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">CCCD:</span>
              <span class="value">${ticket.CCCD || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ngày đặt:</span>
              <span class="value">${ticket.NgayDat ? new Date(ticket.NgayDat).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Tàu:</span>
              <span class="value">${ticket.TenTau || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Toa:</span>
              <span class="value">${ticket.Toa || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ghế:</span>
              <span class="value">${ticket.SoGhe || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Hạng ghế:</span>
              <span class="value">${ticket.HangGhe || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Loại vé:</span>
              <span class="value">${ticket.LoaiVe || '-'}</span>
            </div>
          </div>
          
          <div class="route">
            ${ticket.GaDi || ''} → ${ticket.GaDen || ''}
          </div>
          
          <div class="ticket-info">
            <div class="info-row">
              <span class="label">Ngày đi:</span>
              <span class="value">${ticket.NgayDi ? new Date(ticket.NgayDi).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Giờ đi:</span>
              <span class="value">${ticket.GioDi || '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Ngày đến:</span>
              <span class="value">${ticket.NgayDen ? new Date(ticket.NgayDen).toLocaleDateString('vi-VN') : '-'}</span>
            </div>
            <div class="info-row">
              <span class="label">Thanh toán:</span>
              <span class="value">${ticket.PhuongThucThanhToan || '-'}</span>
            </div>
          </div>
          
          <div class="price">
            Giá vé: ${ticket.DonGia ? ticket.DonGia.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          
          <div class="footer">
            <p>Vui lòng giữ vé này trong suốt hành trình</p>
            <p>Vé có hiệu lực từ ngày ${ticket.NgayDi ? new Date(ticket.NgayDi).toLocaleDateString('vi-VN') : '-'}</p>
            <p>In lúc: ${new Date().toLocaleString('vi-VN')}</p>
            <p>In bởi: Admin</p>
          </div>
        </div>
      `;
      allTicketsHtml += ticketHtml;
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>In nhiều vé tàu</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: white;
            color: black;
          }
          .ticket {
            border: 2px solid #000;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto 20px auto;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .ticket-type {
            font-size: 18px;
            color: #333;
          }
          .ticket-info {
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .label {
            font-weight: bold;
            min-width: 120px;
          }
          .value {
            text-align: right;
            flex: 1;
          }
          .route {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border: 1px solid #ddd;
          }
          .price {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #d32f2f;
            margin: 15px 0;
            padding: 10px;
            background: #fff3e0;
            border: 1px solid #ff9800;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #000;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .ticket { border: none; }
          }
        </style>
      </head>
      <body>
        ${allTicketsHtml}
      </body>
      </html>
    `;
    
    printWindow.document.write(fullHtml);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after content loads
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const columns = [
    { title: 'Mã vé', dataIndex: 'MaVe', key: 'MaVe' },
    { title: 'Khách hàng', dataIndex: 'HoTen', key: 'HoTen' },
    { title: 'Lịch trình', key: 'LichTrinh', render: (_, r) => `${r.GaDi || ''} - ${r.GaDen || ''}` },
    { title: 'Tàu', dataIndex: 'TenTau', key: 'TenTau' },
    { title: 'CCCD', dataIndex: 'CCCD', key: 'CCCD' },
    { title: 'Toa', dataIndex: 'Toa', key: 'Toa' },
    { title: 'Ghế', dataIndex: 'SoGhe', key: 'SoGhe' },
    { 
      title: 'Hạng ghế', 
      dataIndex: 'HangGhe', 
      key: 'HangGhe',
      render: (value) => {
        if (!value) return '-';
        const normalized = String(value).toLowerCase();
        if (/hạng\s*1|hang\s*1|vip|business|thương\s*gia|thuong\s*gia/.test(normalized)) {
          return 'Thương gia';
        }
        if (/hạng\s*2|hạng\s*3|hang\s*2|hang\s*3|economy|phổ\s*thông|pho\s*thong/.test(normalized)) {
          return 'Phổ thông';
        }
        return value;
      }
    },
    { title: 'Loại vé', dataIndex: 'LoaiVe', key: 'LoaiVe' },
    { title: 'Ngày đi', dataIndex: 'NgayDi', key: 'NgayDi', render: v => (v ? String(v) : '-') },
    { title: 'Giờ đi', dataIndex: 'GioDi', key: 'GioDi', render: v => (v ? String(v) : '-') },
    { title: 'Ngày đến', dataIndex: 'NgayDen', key: 'NgayDen', render: v => (v ? String(v) : '-') },
    { title: 'Giá (VND)', dataIndex: 'DonGia', key: 'DonGia' },
    { title: 'Thanh toán', dataIndex: 'PhuongThucThanhToan', key: 'PhuongThucThanhToan', render: (v) => <Tag color={String(v).toUpperCase() === 'VNPAY' ? 'green' : 'blue'}>{v}</Tag> },
    { title: 'Đặt lúc', dataIndex: 'NgayDat', key: 'NgayDat' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={() => printTicket(record)}
            size="small"
            title="In vé"
          />
          <Popconfirm
            title="Xác nhận hủy vé"
            description={`Bạn có chắc chắn muốn hủy vé ${record.MaVe} của khách hàng ${record.HoTen}?`}
            onConfirm={() => cancelTicket(record.MaVe)}
            okText="Có"
            cancelText="Không"
            okType="danger"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              title="Hủy vé"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button onClick={load}>Làm mới</Button>
        {selectedRowKeys.length > 0 && (
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={printMultipleTickets}
          >
            In {selectedRowKeys.length} vé đã chọn
          </Button>
        )}
      </Space>
      <Table
        rowKey="MaVe"
        loading={loading}
        dataSource={data}
        columns={columns}
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 8 }}
        size="small"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (record) => ({
            name: record.MaVe,
          }),
        }}
        expandable={isMobile ? {
          expandedRowRender: (r) => (
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 6 }}>
              <Typography.Text strong>Mã vé</Typography.Text><span>{r.MaVe}</span>
              <Typography.Text strong>Khách hàng</Typography.Text><span>{r.HoTen}</span>
              <Typography.Text strong>Lịch trình</Typography.Text><span>{`${r.GaDi || ''} - ${r.GaDen || ''}`}</span>
              <Typography.Text strong>Tàu</Typography.Text><span>{r.TenTau}</span>
              <Typography.Text strong>CCCD</Typography.Text><span>{r.CCCD}</span>
              <Typography.Text strong>Toa/Ghế</Typography.Text><span>{`${r.Toa || ''}/${r.SoGhe || ''}`}</span>
              <Typography.Text strong>Hạng</Typography.Text><span>{r.HangGhe}</span>
              <Typography.Text strong>Loại vé</Typography.Text><span>{r.LoaiVe}</span>
              <Typography.Text strong>Ngày/giờ đi</Typography.Text><span>{`${r.NgayDi || '-'} ${r.GioDi || ''}`}</span>
              <Typography.Text strong>Ngày đến</Typography.Text><span>{r.NgayDen || '-'}</span>
              <Typography.Text strong>Giá</Typography.Text><span>{r.DonGia}</span>
              <Typography.Text strong>Thanh toán</Typography.Text><span>{r.PhuongThucThanhToan}</span>
              <Typography.Text strong>Đặt lúc</Typography.Text><span>{r.NgayDat}</span>
              <Typography.Text strong>Hành động</Typography.Text>
              <span>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PrinterOutlined />} 
                    onClick={() => printTicket(r)}
                    size="small"
                    title="In vé"
                  />
                  <Popconfirm
                    title="Xác nhận hủy vé"
                    description={`Bạn có chắc chắn muốn hủy vé ${r.MaVe} của khách hàng ${r.HoTen}?`}
                    onConfirm={() => cancelTicket(r.MaVe)}
                    okText="Có"
                    cancelText="Không"
                    okType="danger"
                  >
                    <Button 
                      type="primary" 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="small"
                      title="Hủy vé"
                    />
                  </Popconfirm>
                </Space>
              </span>
            </div>
          ),
          showExpandColumn: true
        } : undefined}
      />
    </>
  );
};

export default AdminTickets;


