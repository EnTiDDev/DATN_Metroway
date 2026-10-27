// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button, Typography, Row, Col, Card, Input, DatePicker, Select, Table, Tooltip, Dropdown, Modal, Space, Avatar, Spin, App as AntdApp } from 'antd';
import { SearchOutlined, CreditCardOutlined, ScheduleOutlined, SafetyOutlined, SwapOutlined, UserOutlined, MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../css/Landing.css';
import trainLanding from '../assets/train landing.jpg';
import bookingIcon from '../assets/booking-icon.jpg';
import ticketIcon from '../assets/ticket.jpg';

const { Title, Paragraph, Text } = Typography;

const Landing = () => {
  const navigate = useNavigate();
  const [chatVisible, setChatVisible] = React.useState(false);
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Chào buổi sáng!';
    } else if (hour < 17) {
      greeting = 'Chào buổi chiều!';
    } else {
      greeting = 'Chào buổi tối!';
    }
    
    return `${greeting} Tôi là trợ lý ảo của hệ thống đặt vé tàu. Tôi có thể giúp bạn tìm hiểu về dịch vụ đặt vé, lịch trình, giá cả và các thông tin khác. Bạn cần hỗ trợ gì?`;
  };

  const { message } = AntdApp.useApp();
  const [messages, setMessages] = React.useState([
    { type: 'bot', content: getWelcomeMessage() }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [conversationContext, setConversationContext] = React.useState({});
  const messagesEndRef = React.useRef(null);

  const goLogin = () => navigate('/login');
  const [from, setFrom] = React.useState();
  const [to, setTo] = React.useState();
  const [date, setDate] = React.useState();
  const [stations, setStations] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [authTick, setAuthTick] = React.useState(0);

  // Enhanced chatbot responses with more context and suggestions
  const botResponses = {
    'đặt vé': {
      response: 'Để đặt vé tàu, bạn cần:\n1. Đăng nhập vào hệ thống\n2. Chọn lịch trình (ga đi - ga đến)\n3. Chọn toa và ghế ngồi\n4. Chọn loại vé (1 chiều/Khứ hồi)\n5. Thanh toán qua VNPAY hoặc tiền mặt\n\nBạn có muốn tôi hướng dẫn chi tiết từng bước không?',
      suggestions: ['Hướng dẫn chi tiết', 'Giá vé', 'Phương thức thanh toán']
    },
    'lịch trình': {
      response: 'Bạn có thể tra cứu lịch trình bằng cách:\n1. Chọn ga đi và ga đến ở form tìm kiếm phía trên\n2. Xem thông tin chi tiết về thời gian, giá vé\n3. Lịch trình sẽ hiển thị các chuyến tàu khả dụng\n\nBạn muốn tìm lịch trình từ ga nào đến ga nào?',
      suggestions: ['Hà Nội - TP.HCM', 'Đà Nẵng - Hà Nội', 'Tìm kiếm lịch trình']
    },
    'giá vé': {
      response: 'Giá vé tàu phụ thuộc vào:\n• Lịch trình (quãng đường)\n• Loại ghế: Phổ thông (giá gốc) hoặc Thương gia (+50%)\n• Loại vé: 1 chiều hoặc Khứ hồi (x2)\n• Số lượng vé\n\nVí dụ: Vé Hà Nội - TP.HCM ghế phổ thông khoảng 800,000đ, ghế thương gia khoảng 1,200,000đ.',
      suggestions: ['Xem bảng giá', 'So sánh loại ghế', 'Tính giá vé']
    },
    'hủy vé': {
      response: 'Chính sách hủy vé:\n• Vé thanh toán tiền mặt: Có thể hủy trong phần "Vé của tôi"\n• Vé thanh toán VNPAY: Không thể hủy\n• Thời gian hủy: Trước giờ khởi hành 2 tiếng\n• Phí hủy: 10% giá vé\n\nBạn cần hủy vé nào?',
      suggestions: ['Hướng dẫn hủy vé', 'Liên hệ hỗ trợ', 'Xem vé của tôi']
    },
    'thanh toán': {
      response: 'Hệ thống hỗ trợ 2 phương thức thanh toán:\n\n💳 VNPAY:\n• Thanh toán online an toàn\n• Nhận vé ngay sau thanh toán\n• Không thể hủy vé\n\n💵 Tiền mặt:\n• Thanh toán khi nhận vé\n• Có thể hủy vé\n• Thanh toán tại ga\n\nBạn muốn thanh toán bằng cách nào?',
      suggestions: ['Thanh toán VNPAY', 'Thanh toán tiền mặt', 'Hướng dẫn thanh toán']
    },
    'ghế thương gia': {
      response: 'Ghế Thương gia:\n• Giá cao hơn 50% so với ghế Phổ thông\n• Không gian rộng rãi, thoải mái hơn\n• Dịch vụ ưu tiên\n• Thường ở toa đầu tàu\n• Phù hợp cho hành trình dài\n\nBạn có muốn biết thêm về ghế Phổ thông không?',
      suggestions: ['Ghế Phổ thông', 'So sánh loại ghế', 'Đặt vé thương gia']
    },
    'ghế phổ thông': {
      response: 'Ghế Phổ thông:\n• Giá vé cơ bản\n• Đầy đủ tiện nghi cần thiết\n• Phù hợp với mọi đối tượng\n• Số lượng ghế nhiều\n• Giá cả hợp lý\n\nĐây là lựa chọn phổ biến nhất cho hành khách.',
      suggestions: ['Ghế Thương gia', 'So sánh loại ghế', 'Đặt vé phổ thông']
    },
    'đăng nhập': {
      response: 'Để đăng nhập:\n1. Nhấn nút "Đăng nhập" ở góc trên bên phải\n2. Nhập tài khoản và mật khẩu\n3. Chọn vai trò (Hành khách/Nhân viên/Admin)\n4. Nhấn "Đăng nhập"\n\nBạn chưa có tài khoản? Tôi có thể hướng dẫn đăng ký.',
      suggestions: ['Đăng ký tài khoản', 'Quên mật khẩu', 'Hỗ trợ đăng nhập']
    },
    'đăng ký': {
      response: 'Để đăng ký tài khoản:\n1. Nhấn nút "Đăng ký" ở trang đăng nhập\n2. Điền đầy đủ thông tin cá nhân\n3. Tạo mật khẩu an toàn\n4. Xác nhận thông tin\n5. Hoàn tất đăng ký\n\nSau khi đăng ký, bạn có thể đặt vé ngay!',
      suggestions: ['Đăng nhập', 'Hướng dẫn đặt vé', 'Liên hệ hỗ trợ']
    },
    'quên mật khẩu': {
      response: 'Nếu quên mật khẩu:\n1. Nhấn "Quên mật khẩu" ở trang đăng nhập\n2. Nhập email hoặc số điện thoại đã đăng ký\n3. Hệ thống sẽ gửi mã xác nhận\n4. Nhập mã và tạo mật khẩu mới\n\nBạn cần hỗ trợ thêm không?',
      suggestions: ['Liên hệ hỗ trợ', 'Đăng ký mới', 'Hướng dẫn đăng nhập']
    },
    'liên hệ': {
      response: 'Thông tin liên hệ:\n\n📞 Hotline: 1900-xxxx\n📧 Email: support@metroway.com\n🏢 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM\n⏰ Giờ làm việc: 7:00 - 22:00 (Thứ 2 - Chủ nhật)\n\nBạn cần hỗ trợ về vấn đề gì?',
      suggestions: ['Hướng dẫn sử dụng', 'Báo cáo lỗi', 'Góp ý']
    },
    'lỗi': {
      response: 'Nếu gặp lỗi khi sử dụng:\n1. Kiểm tra kết nối internet\n2. Thử làm mới trang (F5)\n3. Xóa cache trình duyệt\n4. Thử trình duyệt khác\n5. Liên hệ hỗ trợ nếu vẫn không được\n\nBạn gặp lỗi gì cụ thể?',
      suggestions: ['Lỗi đăng nhập', 'Lỗi đặt vé', 'Lỗi thanh toán', 'Liên hệ hỗ trợ']
    },
    'góp ý': {
      response: 'Cảm ơn bạn đã góp ý! Chúng tôi luôn cải thiện dịch vụ.\n\nĐể gửi góp ý:\n1. Email: feedback@metroway.com\n2. Form online: /feedback\n3. Hotline: 1900-xxxx\n\nGóp ý của bạn rất quan trọng với chúng tôi!',
      suggestions: ['Đánh giá dịch vụ', 'Báo cáo lỗi', 'Đề xuất cải tiến']
    },
    'thời gian': {
      response: 'Thông tin về thời gian:\n\n⏰ Giờ làm việc: 7:00 - 22:00\n📅 Ngày làm việc: Thứ 2 - Chủ nhật\n🚂 Tàu chạy: 24/7\n⏱️ Thời gian đặt vé: Bất kỳ lúc nào\n\nBạn cần thông tin gì khác?',
      suggestions: ['Lịch trình tàu', 'Thời gian khởi hành', 'Liên hệ hỗ trợ']
    },
    'help': {
      response: 'Tôi có thể giúp bạn với các vấn đề sau:\n\n🎫 Đặt vé tàu\n🚂 Tra cứu lịch trình\n💰 Thông tin giá vé\n❌ Hủy vé\n💳 Thanh toán\n🪑 Loại ghế ngồi\n🔐 Đăng nhập/Đăng ký\n📞 Liên hệ hỗ trợ\n⏰ Thời gian làm việc\n\nBạn cần hỗ trợ về vấn đề gì?',
      suggestions: ['Đặt vé', 'Lịch trình', 'Giá vé', 'Thanh toán', 'Liên hệ']
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (callback) => {
    setIsTyping(true);
    const typingTime = 800 + Math.random() * 1200; // More realistic typing time
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingTime);
  };

  // Auto-respond to common patterns
  const autoRespond = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Greeting patterns
    if (/xin chào|hello|hi|chào/.test(lowerInput)) {
      return {
        response: 'Xin chào! Rất vui được gặp bạn. Tôi có thể giúp gì cho bạn về dịch vụ đặt vé tàu?',
        suggestions: ['Đặt vé', 'Tìm lịch trình', 'Xem giá vé']
      };
    }
    
    // Thank you patterns
    if (/cảm ơn|thank|thanks/.test(lowerInput)) {
      return {
        response: 'Rất vui được giúp bạn! Nếu cần hỗ trợ thêm, đừng ngại hỏi nhé. Chúc bạn có chuyến đi thú vị! 😊',
        suggestions: ['Đặt vé', 'Xem lịch trình', 'Liên hệ hỗ trợ']
      };
    }
    
    // Goodbye patterns
    if (/tạm biệt|goodbye|bye|chào/.test(lowerInput)) {
      return {
        response: 'Tạm biệt! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúc bạn có chuyến đi an toàn và thú vị! 🚂',
        suggestions: ['Đặt vé', 'Xem lịch trình', 'Liên hệ hỗ trợ']
      };
    }
    
    return null;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    
    // Enhanced bot response with intelligent matching
    const lowerInput = inputValue.toLowerCase();
    
    // Check for auto-response patterns first
    const autoResponse = autoRespond(inputValue);
    if (autoResponse) {
      simulateTyping(() => {
        setMessages(prev => [...prev, { type: 'bot', content: autoResponse.response, suggestions: autoResponse.suggestions }]);
      });
      setInputValue('');
      return;
    }
    
    let botResponse = {
      response: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về: đặt vé, lịch trình, giá vé, hủy vé, thanh toán, hoặc loại ghế ngồi.',
      suggestions: ['Đặt vé', 'Lịch trình', 'Giá vé', 'Help']
    };
    
    // Intelligent keyword matching with priority
    const keywords = [
      { key: 'đăng nhập', priority: 10 },
      { key: 'đăng ký', priority: 10 },
      { key: 'quên mật khẩu', priority: 9 },
      { key: 'liên hệ', priority: 8 },
      { key: 'lỗi', priority: 8 },
      { key: 'góp ý', priority: 7 },
      { key: 'thời gian', priority: 7 },
      { key: 'đặt vé', priority: 6 },
      { key: 'lịch trình', priority: 6 },
      { key: 'giá vé', priority: 6 },
      { key: 'hủy vé', priority: 6 },
      { key: 'thanh toán', priority: 6 },
      { key: 'ghế thương gia', priority: 5 },
      { key: 'ghế phổ thông', priority: 5 },
      { key: 'help', priority: 1 }
    ];
    
    // Find the best match based on priority and presence
    let bestMatch = null;
    let highestPriority = 0;
    
    for (const keyword of keywords) {
      if (lowerInput.includes(keyword.key) && keyword.priority > highestPriority) {
        bestMatch = keyword.key;
        highestPriority = keyword.priority;
      }
    }
    
    if (bestMatch && botResponses[bestMatch]) {
      botResponse = botResponses[bestMatch];
    }
    
    // Add contextual responses based on conversation history
    const recentMessages = messages.slice(-3);
    const hasAskedAboutBooking = recentMessages.some(msg => 
      msg.type === 'user' && msg.content.toLowerCase().includes('đặt vé')
    );
    
    if (hasAskedAboutBooking && lowerInput.includes('giá')) {
      botResponse = botResponses['giá vé'];
    }
    
    simulateTyping(() => {
      setMessages(prev => [...prev, { type: 'bot', content: botResponse.response, suggestions: botResponse.suggestions }]);
      
      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        lastTopic: bestMatch,
        lastUserInput: inputValue,
        conversationCount: (prev.conversationCount || 0) + 1
      }));
    });
    
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Don't call handleSendMessage immediately to allow user to see the input
  };

  const handleQuickAction = (action) => {
    let response = '';
    let suggestions = [];
    
    switch (action) {
      case 'search_schedule':
        response = 'Để tìm lịch trình, hãy sử dụng form tìm kiếm phía trên. Chọn ga đi và ga đến, sau đó nhấn "Tìm kiếm".';
        suggestions = ['Hà Nội - TP.HCM', 'Đà Nẵng - Hà Nội', 'Tìm kiếm lịch trình'];
        break;
      case 'book_ticket':
        response = 'Để đặt vé, bạn cần đăng nhập trước. Sau đó vào phần "Đặt vé" để chọn lịch trình và ghế ngồi.';
        suggestions = ['Đăng nhập', 'Hướng dẫn đặt vé', 'Xem lịch trình'];
        break;
      case 'check_price':
        response = 'Giá vé phụ thuộc vào lịch trình và loại ghế. Bạn có thể xem giá khi chọn lịch trình cụ thể.';
        suggestions = ['Xem bảng giá', 'So sánh loại ghế', 'Tính giá vé'];
        break;
      default:
        return;
    }
    
    simulateTyping(() => {
      setMessages(prev => [...prev, { type: 'bot', content: response, suggestions }]);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fetch stations from API
  React.useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('http://localhost:8081/schedules/stations');
        const data = await res.json();
        setStations(data.map(item => ({ value: item.station, label: item.station })));
      } catch (e) {
        console.error('Error fetching stations:', e);
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

  const performSearch = async () => {
    if (!from || !to) { message.warning('Vui lòng chọn ga đi và ga đến'); return; }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/schedules/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await res.json();
      const rows = (data || []).map(item => ({
        key: item.MaLichTrinh,
        departure: item.GaDi,
        arrival: item.GaDen,
        departureTime: item.NgayDi,
        time: item.GioDi,
        arrivalTime: item.NgayDen,
        price: item.DonGia,
        train: item.TenTau
      }));
      setResults(rows);
      if (rows.length === 0) message.info('Không tìm thấy lịch trình phù hợp');
    } catch (e) {
      console.error(e);
      message.error('Đã xảy ra lỗi khi tải lịch trình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AntdApp>
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__brand">Metroway</div>
        <div className="landing__actions">
          {(() => {
            const adminRole = localStorage.getItem('admin_role');
            const userRole = localStorage.getItem('user_role');
            const role = adminRole || userRole || localStorage.getItem('role');
            const loggedIn = !!(localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token'));

            const onLogout = () => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('hoten');
              localStorage.removeItem('maKh');
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_role');
              localStorage.removeItem('admin_hoten');
              localStorage.removeItem('user_token');
              localStorage.removeItem('user_role');
              message.success('Đã đăng xuất');
              setAuthTick(t => t + 1);
            };

            const menuItems = !loggedIn
              ? [
                  { key: 'login', label: <span onClick={goLogin}>Đăng nhập</span> },
                  { key: 'register', label: <span onClick={() => navigate('/register')}>Đăng ký</span> },
                ]
              : role === 'admin' || role === 'employee'
              ? [
                  { key: 'admin', label: <span onClick={() => navigate('/admin/home')}>Quản trị</span> },
                  { key: 'tickets', label: <span onClick={() => navigate('/admin/tickets')}>Vé đặt</span> },
                  { key: 'logout', label: <span onClick={onLogout}>Đăng xuất</span> },
                ]
              : [
                  { key: 'user', label: <span onClick={() => navigate('/app/home')}>Trang của tôi</span> },
                  { key: 'mytickets', label: <span onClick={() => navigate('/app/my-tickets')}>Vé của tôi</span> },
                  { key: 'logout', label: <span onClick={onLogout}>Đăng xuất</span> },
                ];

            return (
              <Dropdown placement="bottomRight" trigger={["click"]} menu={{ items: menuItems }}>
                <Tooltip title="Tài khoản">
                  <Button shape="circle" icon={<UserOutlined />} />
                </Tooltip>
              </Dropdown>
            );
          })()}
        </div>
      </header>

      <section className="landing__hero">
        <div className="landing__bg" aria-hidden>
          <img src={trainLanding} alt="" />
        </div>
        <div className="landing__hero-content">
          <Title className="landing__title" level={1}>Đặt vé tàu nhanh, đơn giản, an toàn</Title>
          <Paragraph className="landing__subtitle">Tìm chuyến đi phù hợp, giữ chỗ tức thì, thanh toán bảo mật. Trải nghiệm đặt vé trơn tru trên mọi thiết bị.</Paragraph>
          <div className="landing__cta">
            <Button size="large" type="primary" icon={<SearchOutlined />} onClick={performSearch}>Tìm chuyến</Button>
            {(() => {
              const role = (localStorage.getItem('admin_role') || localStorage.getItem('user_role') || localStorage.getItem('role'));
              const loggedIn = !!(localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token'));
              if (!loggedIn) {
                return (
                  <Button size="large" style={{ marginLeft: 12 }} onClick={() => navigate('/login')}>
                    Đặt vé ngay
                  </Button>
                );
              }
              if (role === 'hanhkhach') {
                return (
                  <Button size="large" style={{ marginLeft: 12 }} onClick={() => navigate('/app/ticket-booking')}>
                    Đặt vé ngay
                  </Button>
                );
              }
              // admin/employee: không hiển thị nút đặt vé ngay
              return null;
            })()}
          </div>
        </div>
        <div className="landing__search-preview">
          <Card className="landing__search-card" bordered={false} styles={{ body: { padding: 16 } }}>
            <Row gutter={12} align="middle">
              <Col xs={24} md={8}>
                <Select
                  placeholder="Ga đi"
                  value={from}
                  onChange={setFrom}
                  style={{ width: '100%' }}
                  listHeight={240}
                  dropdownStyle={{ maxHeight: 240, overflow: 'auto' }}
                  options={stations}
                />
              </Col>
              <Col xs={24} md={1} style={{ display:'flex', justifyContent:'center' }}>
                <Button shape="circle" icon={<SwapOutlined />} onClick={() => { const a=from; setFrom(to); setTo(a); }} />
              </Col>
              <Col xs={24} md={7}>
                <Select
                  placeholder="Ga đến"
                  value={to}
                  onChange={setTo}
                  style={{ width: '100%' }}
                  listHeight={240}
                  dropdownStyle={{ maxHeight: 240, overflow: 'auto' }}
                  options={stations}
                />
              </Col>
              <Col xs={24} md={8}><DatePicker style={{ width: '100%' }} value={date} onChange={setDate} placeholder="Ngày đi (tùy chọn)" /></Col>
            </Row>
            <Button type="primary" block style={{ marginTop: 12 }} onClick={performSearch} loading={loading}>Tìm chuyến</Button>
          </Card>
          {results && results.length > 0 && (
            <Card style={{ marginTop: 16, borderRadius: 12 }} styles={{ body: { padding: 12 } }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>Kết quả tìm kiếm</Title>
                <Typography.Text type="secondary">{results.length} chuyến</Typography.Text>
              </div>
              <div style={{ maxHeight: 360, overflow: 'auto' }} className="landing__results-scroll">
                <Table
                  dataSource={results}
                  columns={(() => {
                    const cols = [
                      { title: 'Mã lịch trình', dataIndex: 'key', key: 'key', width: 110 },
                      { title: 'Ga đi', dataIndex: 'departure', key: 'departure' },
                      { title: 'Ga đến', dataIndex: 'arrival', key: 'arrival' },
                      { title: 'Ngày đi', dataIndex: 'departureTime', key: 'departureTime', width: 140 },
                      { title: 'Giờ đi', dataIndex: 'time', key: 'time', width: 100 },
                      { title: 'Ngày đến', dataIndex: 'arrivalTime', key: 'arrivalTime', width: 140 },
                      { title: 'Giá (VND)', dataIndex: 'price', key: 'price', width: 140 },
                      { title: 'Tàu', dataIndex: 'train', key: 'train' },
                    ];
                    const role = (localStorage.getItem('admin_role') || localStorage.getItem('user_role') || localStorage.getItem('role'));
                    if (role === 'hanhkhach') {
                      cols.push({ title: 'Hành động', key: 'act', width: 120, render: () => (
                        <Button type="link" onClick={() => navigate('/app/ticket-booking')}>Đặt vé</Button>
                      )});
                    }
                    return cols;
                  })()}
                  bordered
                  size="small"
                  pagination={false}
                  scroll={{ x: true }}
                />
              </div>
            </Card>
          )}
        </div>
        <div className="landing__hero-art" aria-hidden>
          <div className="blob blob--1" />
          <div className="blob blob--2" />
        </div>
      </section>

      <section className="landing__features">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable className="landing__feature-card">
              <ScheduleOutlined className="feature__icon" />
              <Title level={4}>Tra cứu linh hoạt</Title>
              <Paragraph>Tìm kiếm theo ga đi/đến, ngày giờ, giá vé và tình trạng chỗ trống.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable className="landing__feature-card">
              <CreditCardOutlined className="feature__icon" />
              <Title level={4}>Thanh toán đa dạng</Title>
              <Paragraph>Hỗ trợ VNPAY hoặc tiền mặt khi nhận vé, linh hoạt theo nhu cầu.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable className="landing__feature-card">
              <SafetyOutlined className="feature__icon" />
              <Title level={4}>Bảo mật & tin cậy</Title>
              <Paragraph>Dữ liệu được bảo vệ, quy trình đặt vé và hoàn/đổi minh bạch.</Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="landing__cta-wide">
        <Title level={3} style={{ color: '#fff', margin: 0 }}>Sẵn sàng cho chuyến đi tiếp theo?</Title>
        <div />
      </section>

      <footer className="landing__footer">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Title level={5}>Metroway</Title>
            <Text>Hệ thống đặt vé tàu trực tuyến – nhanh chóng và thân thiện.</Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Text>© {new Date().getFullYear()} Metroway</Text>
          </Col>
        </Row>
      </footer>

      {/* Enhanced Chatbot */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        {/* Chat Button */}
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={() => setChatVisible(!chatVisible)}
          style={{
            width: 60,
            height: 60,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        />
        
        {/* Chat Window */}
        {chatVisible && (
          <Card
            style={{
              position: 'absolute',
              bottom: 80,
              right: 0,
              width: 380,
              height: 550,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: 16,
              border: 'none'
            }}
            bodyStyle={{ padding: 0, height: '100%' }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              padding: '16px 20px', 
              borderTopLeftRadius: 16, 
              borderTopRightRadius: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar 
                  size={32}
                  icon={<RobotOutlined />}
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                />
                <div>
                  <Text strong style={{ color: 'white', fontSize: 16 }}>Trợ lý ảo</Text>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Online</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setChatVisible(false);
                    setMessages([{ type: 'bot', content: getWelcomeMessage() }]);
                    setConversationContext({});
                  }}
                  style={{ color: 'white' }}
                  title="Đóng chat"
                />
                <Button
                  type="text"
                  onClick={() => {
                    setMessages([{ type: 'bot', content: getWelcomeMessage() }]);
                    setConversationContext({});
                  }}
                  style={{ color: 'white', fontSize: 12 }}
                  title="Bắt đầu lại"
                >
                  🔄
                </Button>
              </div>
            </div>
            
                          <div style={{ 
                height: 'calc(100% - 140px)', 
                overflowY: 'auto', 
                padding: '20px',
                background: '#f8f9fa'
              }}>
                {/* Quick Action Buttons */}
                {messages.length === 1 && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 8, 
                    marginBottom: 20,
                    padding: '16px',
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Text strong style={{ marginBottom: 8 }}>Thao tác nhanh:</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <Button 
                        size="small" 
                        onClick={() => handleQuickAction('search_schedule')}
                        style={{ borderRadius: 16, fontSize: 11 }}
                      >
                        🔍 Tìm lịch trình
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => handleQuickAction('book_ticket')}
                        style={{ borderRadius: 16, fontSize: 11 }}
                      >
                        🎫 Đặt vé
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => handleQuickAction('check_price')}
                        style={{ borderRadius: 16, fontSize: 11 }}
                      >
                        💰 Xem giá
                      </Button>
                    </div>
                  </div>
                )}
              {messages.map((msg, index) => (
                <div key={index} style={{ 
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                  gap: 12
                }}>
                  <Avatar 
                    size={36}
                    icon={msg.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{ 
                      background: msg.type === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#52c41a',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 16px',
                    borderRadius: 18,
                    background: msg.type === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: msg.type === 'user' ? 'white' : '#333',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5
                  }}>
                    {msg.content}
                    {msg.suggestions && (
                      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {msg.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            size="small"
                            type="text"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                              color: msg.type === 'user' ? 'white' : '#666',
                              border: 'none',
                              borderRadius: 12,
                              fontSize: 11,
                              padding: '4px 8px',
                              height: 'auto'
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '12px 16px',
                  background: 'white',
                  borderRadius: 18,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  maxWidth: '75%'
                }}>
                  <Avatar 
                    size={36}
                    icon={<RobotOutlined />}
                    style={{ background: '#52c41a', flexShrink: 0 }}
                  />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', animation: 'typing 1.4s infinite ease-in-out' }}></div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', animation: 'typing 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#52c41a', animation: 'typing 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid #f0f0f0',
              background: 'white'
            }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{ borderRadius: 20 }}
                />
                <Button 
                  type="primary" 
                  onClick={handleSendMessage}
                  icon={<SendOutlined />}
                  style={{ 
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                />
              </Space.Compact>
            </div>
          </Card>
        )}
      </div>
    </div>
    </AntdApp>
  );
};

export default Landing;


