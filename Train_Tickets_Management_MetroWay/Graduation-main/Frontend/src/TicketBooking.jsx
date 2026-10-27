import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Button,
  Typography,
  Row,
  Col,
  DatePicker,
  Modal,
  App as AntdApp,
  Tag,
} from "antd";
import moment from "moment";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const fieldLabels = {
  ticketCode: "Mã vé",
  departureDate: "Ngày đi",
  route: "Lịch trình",
  train: "Tàu",
  departureTime: "Giờ đi",
  price: "Giá vé",
  time: "Giờ đi",
  quantity: "Số lượng",
  paymentMethod: "Phương thức thanh toán",
  ticketType: "Loại vé",
  carriage: "Toa",
  seat: "Số ghế",
  seatClass: "Hạng ghế",
};

const TicketBooking = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [ticketType, setTicketType] = useState(undefined); // 1 chiều / Khứ hồi
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [carriages, setCarriages] = useState([]);
  const [seatList, setSeatList] = useState([]);
  const [seatClasses, setSeatClasses] = useState([]);
  const watchedSeatClass = Form.useWatch('seatClass', form);

  // Map class to base color for visualization
  const getSeatColorByClass = (cls) => {
    const normalized = (cls || '').toString().toLowerCase();
    if (normalized.includes('thương gia')) return '#ffe8e8';
    if (normalized.includes('phổ thông')) return '#e8f5ff';
    if (normalized.includes('giường nằm')) return '#fff3cd';
    if (normalized.includes('ghế mềm')) return '#e8f5ff';
    if (normalized.includes('ghế cứng')) return '#e8ffe8';
    return '#fff';
  };

  // Calculate price based on seat class
  const calculatePriceBySeatClass = (basePrice, seatClass) => {
    if (!basePrice) return 0;
    const normalized = (seatClass || '').toString().toLowerCase();
    if (normalized.includes('thương gia')) {
      return Math.round(basePrice * 1.5); // 50% premium for business class
    }
    return basePrice; // Standard price for economy class
  };

  // Get selected seat class for pricing
  const getSelectedSeatClass = () => {
    if (selectedSeats.length === 0) return null;
    const firstSeat = seatList.find(s => s.code === selectedSeats[0]);
    return firstSeat?.class || null;
  };
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:8888';
  const watchedRoute = Form.useWatch('route', form);
  const watchedDepartureDate = Form.useWatch('departureDate', form);
  const watchedTime = Form.useWatch('time', form);
  const watchedCarriage = Form.useWatch('carriage', form);

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

  // Function to get query parameters
  const getQueryParams = (query) => {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
          .split('&')
          .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
          }, {})
      : {};
  };

  // Get the code parameter from the query string
  const queryParams = getQueryParams(location.search);
  const code = queryParams?.code;

  const  handleChangTicketType = (value) => {
    setTicketType(value);
  }

  // const onQuantityChange = (value) => {
  //   (value);
  // }

  useEffect(() => {
    const base = Number(selectedSchedule?.price || 0);
    const seatClass = getSelectedSeatClass();
    const pricePerTicket = calculatePriceBySeatClass(base, seatClass);
    const roundTripFactor = ticketType === 'Khứ hồi' ? 2 : 1;
    const result = pricePerTicket * roundTripFactor * Number(ticketQuantity || 0);
    setTotalPrice(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketType, ticketQuantity, selectedSchedule, selectedSeats, seatList]);
  // Build seat map from catalog seats; fallback to placeholder if no data
  useEffect(() => {
    const cols = 6;
    const filtered = (seatList && seatList.length > 0)
      ? seatList.filter(s => !watchedSeatClass || s.class === watchedSeatClass)
      : [];
    const normalized = (filtered && filtered.length > 0)
      ? filtered.map(s => ({ code: s.code, booked: bookedSeats.has(s.code), class: s.class }))
      : Array.from({ length: 30 }).map((_, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          const code = String.fromCharCode(65 + row) + (col + 1);
          return { code, booked: bookedSeats.has(code), class: undefined };
        });
    const rows = [];
    for (let i = 0; i < normalized.length; i += cols) {
      rows.push(normalized.slice(i, i + cols));
    }
    setSeatMap(rows);
  }, [bookedSeats, seatList, watchedSeatClass]);

  // Load carriages when schedule (route) changes
  useEffect(() => {
    const loadCarriages = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/schedules/${watchedRoute}/carriages`);
        const rows = Array.isArray(res.data) ? res.data : [];
        // sort by number (numeric then fallback)
        rows.sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
        setCarriages(rows);
      } catch (e) { setCarriages([]); }
    };
    if (watchedRoute) {
      loadCarriages();
      // reset dependent fields
      form.setFieldsValue({ carriage: undefined, seat: undefined, seatClass: undefined });
      setSelectedSeats([]);
      setSeatList([]);
      setBookedSeats(new Set());
      setSeatClasses([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedRoute]);

  // Load seats when carriage changes
  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/carriages/${watchedCarriage}/seats`);
        const list = res.data || [];
        setSeatList(list);
        const classes = Array.from(new Set(list.map(s => s.class).filter(Boolean)));
        setSeatClasses(classes);
      } catch (e) { setSeatList([]); }
    };
    if (watchedCarriage) {
      loadSeats();
      form.setFieldsValue({ seat: undefined, seatClass: undefined });
      setSelectedSeats([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCarriage]);

  useEffect(() => {
    const fetchBooked = async () => {
      try{
        const routeId = watchedRoute;
        const dep = watchedDepartureDate?.format('YYYY-MM-DD');
        const timeVal = watchedTime;
        const carriageVal = watchedCarriage;
        if (!routeId || !dep || !timeVal || !carriageVal) return;
        const res = await axios.get('http://localhost:8081/booked-seats', { params: {
          route: routeId, departureDate: dep, time: timeVal, carriage: carriageVal
        }});
        const set = new Set((res.data || []).map(s => s.SoGhe));
        setBookedSeats(set);
      }catch(e){ }
    };
    fetchBooked();
  }, [watchedRoute, watchedDepartureDate, watchedTime, watchedCarriage]);

  const toggleSeat = (code) => {
    // simulate selection (respect booked)
    if (bookedSeats.has(code)) return;
    setSelectedSeats(prev => {
      if (prev.includes(code)) return prev.filter(s => s !== code);
      if (prev.length >= ticketQuantity) return prev; // cap by quantity
      return [...prev, code];
    });
  };

  useEffect(() => {
    // sync seat selection length when quantity decreases
    setSelectedSeats(prev => prev.slice(0, Number(ticketQuantity || 0)));
  }, [ticketQuantity]);

  // keep seat field in form synced with selected seats
  useEffect(() => {
    form.setFieldsValue({ seat: selectedSeats.join(', ') });
  }, [selectedSeats, form]);

  useEffect(() => {
    if (schedules.length > 0) {
        return;
    }   

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:8081/schedules');
            if (response.data && response.data.length > 0) {
              setSchedules(
                    response.data.map(item => ({
                        key: item.MaLichTrinh,
                        departure: item.GaDi,
                        arrival: item.GaDen,
                        departureTime: item.NgayDi,
                        time: item.GioDi,
                        arrivalTime: item.NgayDen,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleValuesChange = () => {
  //   setTotalPrice(calculateTotalPrice(selectedSchedule?.price));
  // };

  // const getDisabledHours = () => {
  //   const currentHour = moment().hour();
  //   return Array.from({ length: currentHour }, (_, i) => i);
  // };

  const showModal = (values) => {
    const base = Number(selectedSchedule?.price || 0);
    const seatClass = getSelectedSeatClass();
    const pricePerTicket = calculatePriceBySeatClass(base, seatClass);
    const roundTripFactor = values.ticketType === 'Khứ hồi' ? 2 : 1;
    const perTicketPrice = pricePerTicket * roundTripFactor;
    const formattedValues = {
      ...values,
      ticketType: values.ticketType,
      price: perTicketPrice,
      seatClass: seatClass,
      departureDate: values.departureDate ? values.departureDate.format("YYYY-MM-DD") : "",
      departureTime: values.departureTime ? values.departureTime.format("HH:mm") : "",
    };
    setFormValues(formattedValues);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    const token = localStorage.getItem("user_token") || localStorage.getItem("token");
  
    if (!token) {
      message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      return;
    }
  
    setIsLoading(true);
    try {
      if (formValues?.paymentMethod === 'CASH') {
        await handleInsertTicketToDatabase(token, formValues);
      } else {
        await handlePayment(totalPrice);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      if (code === "00" && localStorage.getItem("formValues")) {
        const token = localStorage.getItem("user_token") || localStorage.getItem("token");
        const formValues = JSON.parse(localStorage.getItem("formValues"));
        localStorage.removeItem("formValues");

        handleInsertTicketToDatabase(token, formValues);
      } else if (code === "00" && !localStorage.getItem("formValues")) {
        return;
      } else {
        message.error("Giao dịch thất bại. Đã khôi phục lựa chọn trước đó");
        // restore booking selections if present
        try {
          const saved = localStorage.getItem('formValues');
          if (saved) {
            const fv = JSON.parse(saved);
            setSelectedSchedule(schedules.find(s => s.key === fv.route) || null);
            setTicketType(fv.ticketType);
            setTicketQuantity(fv.quantity);
            form.setFieldsValue({
              route: fv.route,
              departureDate: fv.departureDate ? moment(fv.departureDate) : undefined,
              price: fv.price,
              time: fv.time,
              ticketType: fv.ticketType,
              carriage: fv.carriage,
              quantity: fv.quantity,
              seat: fv.seat,
              paymentMethod: fv.paymentMethod || 'VNPAY',
            });
            // restore seats visual state
            const restoredSeats = String(fv.seat || '')
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
            setSelectedSeats(restoredSeats);
          }
        } catch {}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handlePayment = async (amount) => {
    try {
      const paymentUrl = `${baseUrl}/order/create_payment_url?amount=${amount}`;
      if (paymentUrl && paymentUrl.length > 0) {
        // Save form values BEFORE navigating to VNPay, to ensure availability after return
        localStorage.setItem('formValues', JSON.stringify(formValues));
        window.open(paymentUrl, '_self');
      } else {
        message.error('Không thể tạo liên kết thanh toán.');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      message.error('Đã xảy ra lỗi khi tạo liên kết thanh toán.');
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleInsertTicketToDatabase = async (token, formValues) => {
    try {
      const maKh = localStorage.getItem('maKh');
      const response = await axios.post(
        "http://localhost:8081/booking",
        {
          ticketCode: formValues.ticketCode,
          departureDate: formValues.departureDate,
          quantity: formValues.quantity,
          price: formValues.price,
          ticketType: formValues.ticketType,
          carriage: formValues.carriage,
          seat: formValues.seat,
          time: formValues.time,
          paymentMethod: formValues.paymentMethod,
          route: formValues.route,
          maKh: maKh,
         
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      message.success("Đặt vé thành công: " + response.data.message);
      form.resetFields();
      setIsModalVisible(false);
      navigate('/app/my-tickets');
    } catch (err) {
      console.error("Lỗi đặt vé:", err);
      const status = err?.response?.status;
      const msg = err.response?.data?.message || "Ghế đã có người đặt";
      message.error(msg);
      // If conflict (seat just got booked), refresh booked seats and clear invalid selections
      if (status === 409) {
        try {
          const routeId = watchedRoute;
          const dep = watchedDepartureDate?.format('YYYY-MM-DD');
          const timeVal = watchedTime;
          const carriageVal = watchedCarriage;
          if (routeId && dep && timeVal && carriageVal) {
            const res = await axios.get('http://localhost:8081/booked-seats', { params: {
              route: routeId, departureDate: dep, time: timeVal, carriage: carriageVal
            }});
            const set = new Set((res.data || []).map(s => s.SoGhe));
            setBookedSeats(set);
            // Remove any selected seats that are now booked
            setSelectedSeats(prev => prev.filter(code => !set.has(code)));
          }
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onScheduleSelectChange = (value) => {
    setSelectedSchedule(schedules.find(schedule => schedule.key === value));
  };

  useEffect(() => {
    if (selectedSchedule?.departureTime) {
      form.setFieldsValue({
        departureDate: moment(selectedSchedule.departureTime),
        price: selectedSchedule.price,
        time: selectedSchedule.time,
        train: selectedSchedule.train
      });
    }
  }, [selectedSchedule, form]);

  const { message } = AntdApp.useApp();

  return (
    <div style={{ padding: "4px" }}>
      <Row justify="center">
        <Col xs={24} sm={20} lg={16}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>ĐẶT VÉ</Title>
          <Text type="secondary" style={{ display:'block', textAlign:'center', marginBottom: 16 }}>Chọn lịch trình và ghế ngồi để hoàn tất đặt vé</Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={showModal}
            initialValues={{
              quantity: 1,
              paymentMethod: "VNPAY",
            }}
            style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}
          >
            <Row gutter={[16, 8]}>
              {/* <Col span={12}>
                No need to input ticket code from user, it should be generated by the system
                <Form.Item
                  label={fieldLabels.ticketCode}
                  name="ticketCode"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã vé!" },
                    {
                      pattern: /^[A-Za-z0-9]+$/,
                      message: "Mã vé chỉ được chứa chữ và số!",
                    },
                  ]}
                >
                  <Input placeholder="VHD0001" aria-label={fieldLabels.ticketCode} />
                </Form.Item>
              </Col> */}
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.route}
                  name="route"
                  rules={[{ required: true, message: "Vui lòng chọn lịch trình!" }]}
                >
                  <Select placeholder="Chọn lịch trình" onChange={(value) => onScheduleSelectChange(value)}>
                    {schedules.map(schedule => (
                        <Option key={schedule.key} value={schedule.key}>{schedule.departure} - {schedule.arrival}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.departureDate}
                  name="departureDate"
                  rules={[{ required: true, message: "Vui lòng chọn ngày đi!" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    value={selectedSchedule ? moment(selectedSchedule.departureTime) : null}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={fieldLabels.price} name="price">
                  <Input 
                    className="price" 
                    value={
                      selectedSchedule?.price 
                        ? `${Number(calculatePriceBySeatClass(selectedSchedule.price, getSelectedSeatClass())).toLocaleString('vi-VN')}đ` 
                        : ''
                    } 
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={fieldLabels.train} name="train">
                  <Input readOnly value={selectedSchedule?.train} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.carriage}
                  name="carriage"
                  rules={[{ required: true, message: "Vui lòng chọn toa!" }]}
                >
                  <Select placeholder="Chọn toa" loading={!watchedRoute && carriages.length === 0} notFoundContent={watchedRoute ? 'Chưa có toa nào cho lịch trình này' : 'Chọn lịch trình trước'}>
                    {carriages.map(c => (
                      <Option key={c.number} value={String(c.number)}>
                        {c.number}{c.type ? ` - ${c.type}` : ''}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.ticketType}
                  name="ticketType"
                  rules={[{ required: true, message: "Vui lòng chọn loại vé!" }]}
                >
                  <Select placeholder="Chọn loại vé" onChange={handleChangTicketType}>
                    <Option value="1 chiều">1 chiều</Option>
                    <Option value="Khứ hồi">Khứ hồi</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item 
                  label={fieldLabels.seat} 
                  name="seat"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ghế!' },
                    ({ getFieldValue }) => ({
                      validator() {
                        const qty = Number(getFieldValue('quantity') || 0);
                        if (qty === 0) return Promise.reject(new Error('Số lượng phải lớn hơn 0!'));
                        if (selectedSeats.length !== qty) {
                          return Promise.reject(new Error(`Vui lòng chọn đủ ${qty} ghế`));
                        }
                        return Promise.resolve();
                      }
                    })
                  ]}
                >
                  <Input placeholder="A1, A2" readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={fieldLabels.seatClass} name="seatClass">
                  <Select placeholder="Chọn hạng ghế (tùy chọn)" allowClear notFoundContent={watchedCarriage ? 'Toa chưa cấu hình hạng ghế' : 'Chọn toa trước'}>
                    {seatClasses.map(sc => (
                      <Option key={sc} value={sc}>{sc}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.quantity}
                  name="quantity"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng!" },
                    () => ({
                      validator(_, value) {
                        if (!value || value > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Số lượng phải lớn hơn 0!"));
                      },
                    }),
                  ]}
                >
                  <Input type="number" min={1} onChange={(e) => setTicketQuantity(e.target.value)} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                    label={fieldLabels.time}
                    name="time"
                  >
                    <Input readOnly value={selectedSchedule?.time} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row style={{ display: "flex" }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={fieldLabels.paymentMethod}
                  name="paymentMethod"
                  rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán!" }]}
                >
                  <Radio.Group>
                    <Radio value="VNPAY">VNPAY</Radio>
                    <Radio value="CASH">Tiền mặt</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginTop: "32px", padding: "16px", background: "#f8f9fa", borderRadius: 8, border: "1px solid #e9ecef" }}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>Chi tiết giá vé:</Text>
                  {selectedSchedule?.price && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text>Giá cơ bản:</Text>
                        <Text>{Number(selectedSchedule.price).toLocaleString('vi-VN')}đ</Text>
                      </div>
                      {getSelectedSeatClass() && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <Text>Hạng ghế ({getSelectedSeatClass()}):</Text>
                          <Text>
                            {getSelectedSeatClass()?.toLowerCase().includes('thương gia') ? '+50%' : 'Giá gốc'}
                          </Text>
                        </div>
                      )}
                      {ticketType === 'Khứ hồi' && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <Text>Vé khứ hồi:</Text>
                          <Text>x2</Text>
                        </div>
                      )}
                      {ticketQuantity > 1 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <Text>Số lượng ({ticketQuantity}):</Text>
                          <Text>x{ticketQuantity}</Text>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid #dee2e6" }}>
                        <Text strong>Thành tiền:</Text>
                        <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                          {totalPrice ? `${Number(totalPrice).toLocaleString('vi-VN')}đ` : ""}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={[16,16]}>
              <Col span={24}>
                {selectedSeats.length > 0 && (
                  <div style={{
                    marginBottom: 8,
                    padding: '8px 12px',
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: 8
                  }}>
                    <Text strong>Ghế đã chọn ({selectedSeats.length}): </Text>
                    {selectedSeats.map(code => (
                      <Tag
                        key={code}
                        color="blue"
                        closable
                        onClose={(e) => { e.preventDefault(); toggleSeat(code); }}
                        style={{ marginBottom: 6 }}
                      >
                        {code}
                      </Tag>
                    ))}
                  </div>
                )}
                <div style={{ marginBottom: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {seatClasses.map(sc => (
                    <span key={sc} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 2, background: getSeatColorByClass(sc), border: '1px solid #d9d9d9' }} />
                      <Text type="secondary">{sc}</Text>
                    </span>
                  ))}
                </div>
                {(!watchedCarriage || seatList.length === 0) && (
                  <Text type="secondary">{!watchedCarriage ? 'Vui lòng chọn toa để hiển thị ghế' : 'Toa này chưa có dữ liệu ghế trong danh mục'}</Text>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(56px, 1fr))', gap: 8 }}>
                  {seatMap.flat().map(seat => {
                    const isSelected = selectedSeats.includes(seat.code);
                    return (
                      <button
                        key={seat.code}
                        type="button"
                        onClick={() => toggleSeat(seat.code)}
                        disabled={seat.booked}
                        title={seat.class ? `Hạng: ${seat.class}` : ''}
                        style={{
                          padding: '8px 0',
                          borderRadius: 6,
                          border: isSelected ? '2px solid #1677ff' : '1px solid #d9d9d9',
                          background: seat.booked
                            ? 'var(--seat-booked-bg, #e0e0e0)'
                            : isSelected
                              ? 'var(--seat-selected-bg, #e6f4ff)'
                              : getSeatColorByClass(seat.class),
                          color: seat.booked ? 'var(--seat-booked-fg, #888)' : undefined,
                          opacity: seat.booked ? 0.7 : 1,
                          cursor: seat.booked ? 'not-allowed' : 'pointer',
                          boxShadow: isSelected ? '0 0 0 2px rgba(22,119,255,0.2)' : 'none',
                          transform: isSelected ? 'translateY(1px)' : 'none',
                          transition: 'all .12s ease-in-out'
                        }}
                      >
                        {seat.code}
                      </button>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ marginRight: "10px" }}
              >
                Đặt vé
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Hủy
              </Button>
              <Button style={{ marginLeft: '8px' }} onClick={() => navigate('/app/home')}>
                Quay lại trang chủ
              </Button>
            </Row>
          </Form>
        </Col>
        </Row>
        <Modal
          title="Xác nhận đặt vé"
          open={isModalVisible}
          confirmLoading={isLoading}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <p>Bạn có chắc chắn muốn đặt vé với thông tin sau?</p>
          <ul>
            {formValues &&
              Object.entries(formValues).map(([key, value]) => (
                <li key={key}>
                  <strong>{fieldLabels[key] || key}:</strong> {value?.toString()}
                </li>
              ))}
          </ul>
          <p>
            <strong>Thành tiền:</strong> {totalPrice} VND
          </p>
        </Modal>
    </div>
  );
};

export default TicketBooking;
