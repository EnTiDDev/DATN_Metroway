# Chức năng Admin Hủy Vé

## Tổng quan
Admin và nhân viên (employee) giờ đây có thể hủy vé của hành khách bất kể phương thức thanh toán (VNPAY hoặc tiền mặt).

## Thay đổi Backend

### 1. Model (ticket.model.js)
- Thêm hàm `deleteByAdmin()` để admin có thể hủy vé bất kỳ
- Hàm này không kiểm tra phương thức thanh toán như `deleteIfCash()`

### 2. Controller (tickets.controller.js)
- Thêm hàm `adminCancel()` để xử lý yêu cầu hủy vé của admin
- Trả về thông tin chi tiết về vé đã hủy
- Phân biệt thông báo cho vé VNPAY và tiền mặt

### 3. Routes (tickets.routes.js)
- Thêm route `DELETE /admin/tickets/:id` 
- Yêu cầu xác thực và quyền staff (admin hoặc employee)

## Thay đổi Frontend

### 1. AdminTickets.jsx
- Thêm cột "Hành động" với nút "Hủy vé"
- Sử dụng Popconfirm để xác nhận trước khi hủy
- Hỗ trợ giao diện mobile với expandable rows
- Tự động làm mới danh sách sau khi hủy vé
- Hiển thị thông báo chi tiết khi hủy vé

## Quyền truy cập
- **Admin**: Có thể hủy vé bất kỳ
- **Employee**: Có thể hủy vé bất kỳ  
- **Hành khách**: Chỉ có thể hủy vé thanh toán tiền mặt (không thay đổi)

## API Endpoints

### Hủy vé (Admin/Employee)
```
DELETE /admin/tickets/:id
Authorization: Bearer <token>
Role: admin hoặc employee

Response:
{
  "success": true,
  "message": "Vé đã được hủy thành công (Vé thanh toán VNPAY)",
  "ticketId": 123,
  "paymentMethod": "VNPAY"
}
```

### Hủy vé (Hành khách - chỉ tiền mặt)
```
DELETE /tickets/:id  
Authorization: Bearer <token>
Role: hanhkhach
```

## Testing

### Chạy test script
```bash
cd Graduation-main
node test_admin_cancel.js
```

### Test cases
1. **Hủy vé thường**: Admin có thể hủy vé thanh toán tiền mặt
2. **Hủy vé VNPAY**: Admin có thể hủy vé thanh toán VNPAY
3. **Xác thực quyền**: Chỉ admin/employee mới có thể sử dụng API
4. **Giao diện**: Nút hủy vé hiển thị đúng và hoạt động tốt

## Lưu ý
- Admin có thể hủy vé VNPAY mà không cần hoàn tiền
- Hành khách vẫn chỉ có thể hủy vé thanh toán tiền mặt
- Tất cả thao tác hủy vé đều được ghi log và có xác nhận
- Giao diện responsive, hỗ trợ cả desktop và mobile
- Thông báo chi tiết phân biệt loại thanh toán

## Cài đặt và chạy
1. Khởi động backend server
2. Khởi động frontend
3. Đăng nhập với tài khoản admin hoặc employee
4. Truy cập trang "Vé đặt" trong admin panel
5. Sử dụng nút "Hủy vé" để hủy vé bất kỳ
