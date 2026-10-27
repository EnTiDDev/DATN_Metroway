# Chức Năng In Vé Tàu

## Tổng Quan

Hệ thống quản lý vé tàu đã được bổ sung chức năng in vé hoàn chỉnh, cho phép người dùng và admin in vé từ các trang "Vé của tôi" và "Vé đặt".

## Tính Năng Chính

### 1. In Vé Riêng Lẻ
- **Vị trí**: Cột "Hành động" trong bảng vé
- **Nút**: Icon máy in (🖨️) với tooltip "In vé"
- **Chức năng**: In một vé cụ thể với đầy đủ thông tin

### 2. In Nhiều Vé Cùng Lúc (Bulk Print)
- **Vị trí**: Phía trên bảng vé (hiển thị khi có vé được chọn)
- **Nút**: "In X vé đã chọn" (X là số lượng vé được chọn)
- **Chức năng**: In tất cả vé đã chọn trong một lần in

### 3. Chọn Vé Để In
- **Checkbox**: Mỗi hàng vé có checkbox để chọn
- **Chọn tất cả**: Checkbox ở header để chọn/bỏ chọn tất cả
- **Chọn từng vé**: Click vào checkbox của từng vé cụ thể

### 4. Các Nút Hành Động Khác
- **In vé**: Icon máy in (🖨️) - màu xanh
- **Hủy vé**: Icon thùng rác (🗑️) - màu đỏ
- **Tooltip**: Hiển thị mô tả khi hover chuột

## Cách Sử Dụng

### Trang "Vé của tôi" (MyTickets)
1. Truy cập vào trang "Vé của tôi"
2. Chọn vé muốn in bằng cách:
   - Click checkbox của từng vé
   - Hoặc click checkbox header để chọn tất cả
3. In vé:
   - **In riêng lẻ**: Click nút "In vé" ở cột Hành động
   - **In nhiều vé**: Click nút "In X vé đã chọn" phía trên bảng

### Trang "Vé đặt" (AdminTickets)
1. Truy cập vào trang "Vé đặt" (dành cho admin/employee)
2. Chọn vé muốn in tương tự như trên
3. In vé với các tùy chọn tương tự

## Định Dạng Vé In

### Thông Tin Hiển Thị
- **Header**: Tên công ty và loại vé
- **Thông tin vé**: Mã vé, ngày đặt, tàu, toa, ghế, hạng ghế, loại vé
- **Lịch trình**: Ga đi → Ga đến
- **Thời gian**: Ngày đi, giờ đi, ngày đến
- **Thanh toán**: Phương thức thanh toán
- **Giá vé**: Hiển thị rõ ràng với định dạng VNĐ
- **Footer**: Hướng dẫn sử dụng và thông tin in

### Thiết Kế
- **Giao diện**: Chuyên nghiệp, dễ đọc
- **Màu sắc**: Phù hợp với in đen trắng
- **Bố cục**: Tối ưu cho khổ giấy A4
- **Font chữ**: Arial, dễ đọc

## Tính Năng Kỹ Thuật

### Tự Động In
- Mở hộp thoại in tự động sau khi tạo vé
- Đóng cửa sổ in sau khi hoàn thành

### Hỗ Trợ In Nhiều Vé
- **Ngắt trang**: Tự động ngắt trang giữa các vé
- **Tối ưu**: In nhiều vé trong một lần gọi máy in

### Responsive Design
- **Mobile**: Tối ưu cho thiết bị di động
- **Desktop**: Giao diện đầy đủ cho máy tính

## Lưu Ý Khi Sử Dụng

### Trước Khi In
1. Kiểm tra thông tin vé có chính xác không
2. Đảm bảo máy in đã sẵn sàng
3. Chọn đúng khổ giấy (khuyến nghị A4)

### Khi In
1. Chọn máy in phù hợp
2. Kiểm tra cài đặt in (màu/đen trắng, khổ giấy)
3. Xác nhận số lượng bản in

### Sau Khi In
1. Kiểm tra chất lượng bản in
2. Lưu trữ vé đã in an toàn
3. Đóng cửa sổ in nếu cần

## Xử Lý Lỗi

### Lỗi Thường Gặp
- **Không thể in**: Kiểm tra kết nối máy in
- **Vé không hiển thị**: Làm mới trang và thử lại
- **Thông tin thiếu**: Liên hệ admin để kiểm tra dữ liệu

### Khắc Phục
1. Làm mới trang web
2. Kiểm tra quyền truy cập
3. Liên hệ hỗ trợ kỹ thuật

## Cập Nhật Tương Lai

### Tính Năng Dự Kiến
- **In PDF**: Xuất vé dưới dạng file PDF
- **Email vé**: Gửi vé qua email
- **QR Code**: Thêm mã QR vào vé
- **Barcode**: Thêm mã vạch để quét

### Cải Tiến
- **Template tùy chỉnh**: Cho phép tùy chỉnh mẫu vé
- **Đa ngôn ngữ**: Hỗ trợ tiếng Anh
- **In theo lô**: Tối ưu hóa in số lượng lớn

## Kết Luận

Chức năng in vé đã được tích hợp hoàn chỉnh vào hệ thống, cung cấp trải nghiệm in vé chuyên nghiệp và dễ sử dụng cho cả người dùng và admin. Hệ thống hỗ trợ in vé riêng lẻ và in nhiều vé cùng lúc, với giao diện đẹp và thông tin đầy đủ.
