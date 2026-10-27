// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useMemo } from 'react';
import { Card, Col, DatePicker, Row, Statistic, Tabs, Table, message, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ revenue: 0, tickets: 0 });
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [range, setRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  // Build pivot columns and data for a tabulated monthly-by-column report
  const monthlyPivotColumns = useMemo(() => {
    const cols = [{ title: 'Chỉ số', dataIndex: 'metric', key: 'metric' }];
    (monthly || []).forEach(m => {
      cols.push({ title: m.month, dataIndex: m.month, key: m.month });
    });
    return cols;
  }, [monthly]);

  const monthlyPivotData = useMemo(() => {
    const ticketsRow = { key: 'tickets', metric: 'Vé đã bán' };
    const revenueRow = { key: 'revenue', metric: 'Doanh thu (VND)' };
    (monthly || []).forEach(m => {
      ticketsRow[m.month] = m.tickets;
      revenueRow[m.month] = m.revenue;
    });
    return [ticketsRow, revenueRow];
  }, [monthly]);

  // Inline bar chart helpers (no extra libs)
  const maxDailyRevenue = useMemo(() => Math.max(0, ...daily.map(d => Number(d.revenue) || 0)), [daily]);
  const maxDailyTickets = useMemo(() => Math.max(0, ...daily.map(d => Number(d.tickets) || 0)), [daily]);
  const maxMonthlyRevenue = useMemo(() => Math.max(0, ...monthly.map(m => Number(m.revenue) || 0)), [monthly]);
  const maxMonthlyTickets = useMemo(() => Math.max(0, ...monthly.map(m => Number(m.tickets) || 0)), [monthly]);

  const renderBar = (value, max, color) => {
    const pct = max > 0 ? Math.round((Number(value || 0) / max) * 100) : 0;
    return (
      <div style={{ background: '#f0f0f0', height: 16, borderRadius: 8 }}>
        <div style={{ width: `${pct}%`, height: 16, background: color, borderRadius: 8 }} />
      </div>
    );
  };

  // Simple column chart (pure CSS) for monthly data
  const renderColumnChart = (data, valueKey, labelKey, color, opts = {}) => {
    const { rotateDegrees = 45, labelMaxWidth = 72, itemWidth = 72, barWidth = 36 } = opts;
    const maxVal = Math.max(0, ...data.map(d => Number(d[valueKey]) || 0));
    return (
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 260, padding: '8px 8px 0 8px', minWidth: 520 }}>
          {data.map((d, idx) => {
            const val = Number(d[valueKey]) || 0;
            const h = maxVal > 0 ? Math.max(4, Math.round((val / maxVal) * 180)) : 4;
            const labelText = String(d[labelKey]);
            const labelContainerStyle = rotateDegrees
              ? { marginTop: 8, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }
              : { marginTop: 6 };
            const labelStyle = rotateDegrees
              ? { fontSize: 12, transform: `rotate(${rotateDegrees}deg)`, transformOrigin: 'top left', whiteSpace: 'nowrap', maxWidth: labelMaxWidth }
              : { fontSize: 12, textAlign: 'center', whiteSpace: 'nowrap', maxWidth: labelMaxWidth, overflow: 'hidden', textOverflow: 'ellipsis' };
            return (
              <div key={`${labelKey}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: itemWidth }}>
                <div style={{ marginBottom: 6, fontSize: 12, color: '#555' }}>{val}</div>
                <div style={{ width: barWidth, height: h, background: color, borderRadius: 4 }} />
                <div style={labelContainerStyle}><span style={labelStyle}>{labelText}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
      const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const [summaryRes, dailyRes, monthlyRes] = await Promise.all([
        axios.get('http://localhost:8081/reports/summary', { params: { from: range[0]?.format('YYYY-MM-DD'), to: range[1]?.format('YYYY-MM-DD') }, ...auth }),
        axios.get('http://localhost:8081/reports/daily', { params: { from: range[0]?.format('YYYY-MM-DD'), to: range[1]?.format('YYYY-MM-DD') }, ...auth }),
        axios.get('http://localhost:8081/reports/monthly', auth)
      ]);

      setSummary(summaryRes.data || { revenue: 0, tickets: 0 });
      setDaily(dailyRes.data || []);
      setMonthly(monthlyRes.data || []);
    } catch (e) {
      // Fallback: try older /revenue endpoint if available
      try {
        const revRes = await axios.get('http://localhost:8081/revenue');
        const rev = revRes?.data || {};
        setSummary({ revenue: rev.revenue || 0, tickets: 0 });
        const monthLabel = (range?.[0] || moment()).format('YYYY-MM');
        const monthlyRow = { month: monthLabel, tickets: 0, revenue: rev.revenueByMonth || 0 };
        setMonthly([monthlyRow]);
        setDaily([]);
        message.warning('Đang hiển thị dữ liệu dự phòng từ /revenue');
      } catch (e2) {
        message.error('Không thể tải báo cáo');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range[0], range[1]]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Doanh thu" value={summary.revenue || 0} suffix="VND" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title="Vé đã bán" value={summary.tickets || 0} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Row gutter={8}>
              <Col span={16}><RangePicker value={range} onChange={(v) => setRange(v)} style={{ width: '100%' }} /></Col>
              <Col span={8}><Button block onClick={fetchReports}>Làm mới</Button></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'day',
            label: 'Theo ngày',
            children: (
              <Table
                rowKey={(r) => r.date}
                loading={loading}
                dataSource={daily}
                columns={[
                  { title: 'Ngày', dataIndex: 'date', key: 'date' },
                  { title: 'Vé đã bán', dataIndex: 'tickets', key: 'tickets' },
                  { title: 'Biểu đồ vé', key: 'ticketsBar', render: (_, r) => renderBar(r.tickets, maxDailyTickets, '#1677ff') },
                  { title: 'Doanh thu (VND)', dataIndex: 'revenue', key: 'revenue' },
                  { title: 'Biểu đồ doanh thu', key: 'revenueBar', render: (_, r) => renderBar(r.revenue, maxDailyRevenue, '#52c41a') },
                ]}
              />
            )
          },
          {
            key: 'month',
            label: 'Theo tháng',
            children: (
              <>
                <Table
                  rowKey={(r) => r.month}
                  loading={loading}
                  dataSource={monthly}
                  columns={[
                    { title: 'Tháng', dataIndex: 'month', key: 'month' },
                    { title: 'Vé đã bán', dataIndex: 'tickets', key: 'tickets' },
                    { title: 'Biểu đồ vé', key: 'ticketsBar', render: (_, r) => renderBar(r.tickets, maxMonthlyTickets, '#1677ff') },
                    { title: 'Doanh thu (VND)', dataIndex: 'revenue', key: 'revenue' },
                    { title: 'Biểu đồ doanh thu', key: 'revenueBar', render: (_, r) => renderBar(r.revenue, maxMonthlyRevenue, '#52c41a') },
                  ]}
                />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col xs={24} lg={12}>
                    <Card title="Biểu đồ cột - Vé đã bán" size="small">
                      {renderColumnChart(monthly, 'tickets', 'month', '#f28021', { rotateDegrees: 45, labelMaxWidth: 72 })}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Biểu đồ cột - Doanh thu" size="small">
                      {renderColumnChart(monthly, 'revenue', 'month', '#2f7fc1', { rotateDegrees: 45, labelMaxWidth: 72 })}
                    </Card>
                  </Col>
                </Row>
              </>
            )
          },
          {
            key: 'month-pivot',
            label: 'Bảng cột (Tháng)',
            children: (
              <Table
                rowKey={(r) => r.key}
                loading={loading}
                dataSource={monthlyPivotData}
                columns={monthlyPivotColumns}
                pagination={false}
                bordered
              />
            )
          },
        ]}
      />
    </div>
  );
};

export default Reports;


