-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2025 at 10:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trainticketmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `HoTen` varchar(50) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `DiaChi` varchar(100) DEFAULT NULL,
  `DienThoai` varchar(15) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Username`, `Password`, `HoTen`, `NgaySinh`, `DiaChi`, `DienThoai`, `Email`) VALUES
('admin', '123456', 'Tùng Duong', '2004-07-20', 'Hà Nội', '0337238227', 'duongnb04@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `hanhkhach`
--

CREATE TABLE `hanhkhach` (
  `MaKH` int(255) NOT NULL,
  `CCCD` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `HoTen` varchar(50) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `DiaChi` varchar(100) DEFAULT NULL,
  `DienThoai` varchar(15) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `AdminQuanLy` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hanhkhach`
--

INSERT INTO `hanhkhach` (`MaKH`, `CCCD`, `Password`, `HoTen`, `NgaySinh`, `DiaChi`, `DienThoai`, `Email`, `AdminQuanLy`) VALUES
(1, '3323123231', '123456', 'NguyenTungDuong', '2025-03-06', 'Hưng Yên', '0337238227', 'duongnb04@gmail.com', 'admin'),
(2, '123456789012', '123456', 'Linh', '2024-12-31', 'TP HCM', '0972662222', 'linh@gmail.com', NULL),
(3, '231133567251', '123456', 'Trần Long ', '2025-01-22', 'Hà Nội', '09775849374', 'tranlong@gmail.com', NULL),
(4, '432412312213', '123456', 'Trần Linh', '2025-01-08', 'Ninh Binh', '3245345345', 'linh12@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `MaLichTrinh` int(11) NOT NULL,
  `GaDi` varchar(11) NOT NULL,
  `GaDen` varchar(11) NOT NULL,
  `NgayDi` date NOT NULL,
  `GioDi` time NOT NULL,
  `NgayDen` date NOT NULL,
  `DonGia` decimal(10,2) NOT NULL,
  `TenTau` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lichtrinh`
--

INSERT INTO `lichtrinh` (`MaLichTrinh`, `GaDi`, `GaDen`, `NgayDi`, `GioDi`, `NgayDen`, `DonGia`, `TenTau`) VALUES
(1, 'Hà Nội', 'Hải Dương', '2025-07-31', '19:30:10', '2025-08-31', 100000.00, 'T001'),
(2, 'Hà Nội', 'Đà Nẵng', '2025-07-31', '19:30:10', '2025-08-31', 120000.00, 'T002'),
(3, 'Hà Nội', 'TP. HCM', '2025-07-31', '19:30:10', '2025-08-31', 150000.00, 'T003'),
(4, 'Hà Nội', 'Hải Dương', '2025-06-01', '19:30:10', '2025-07-31', 100000.00, 'T001'),
(5, 'Hà Nội', 'Hải Phòng', '2025-07-31', '08:00:00', '2025-07-31', 80000.00, 'T004'),
(6, 'Hà Nội', 'Nam Định', '2025-07-31', '09:15:00', '2025-07-31', 95000.00, 'T005'),
(7, 'Hà Nội', 'Ninh Bình', '2025-07-31', '10:30:00', '2025-07-31', 110000.00, 'T006'),
(8, 'Hà Nội', 'Thanh Hóa', '2025-07-31', '11:45:00', '2025-07-31', 130000.00, 'T007'),
(9, 'Hà Nội', 'Vinh', '2025-07-31', '13:00:00', '2025-07-31', 180000.00, 'T008'),
(10, 'Hà Nội', 'Huế', '2025-07-31', '14:15:00', '2025-08-01', 250000.00, 'T009'),
(11, 'Hà Nội', 'Quảng Nam', '2025-07-31', '15:30:00', '2025-08-01', 280000.00, 'T010'),
(12, 'Hà Nội', 'Quảng Ngãi', '2025-07-31', '16:45:00', '2025-08-01', 320000.00, 'T011'),
(13, 'Hà Nội', 'Bình Định', '2025-07-31', '18:00:00', '2025-08-01', 350000.00, 'T012'),
(14, 'Hà Nội', 'Phú Yên', '2025-07-31', '19:15:00', '2025-08-01', 380000.00, 'T013'),
(15, 'Hà Nội', 'Khánh Hòa', '2025-07-31', '20:30:00', '2025-08-01', 420000.00, 'T014'),
(16, 'Hà Nội', 'Ninh Thuận', '2025-07-31', '21:45:00', '2025-08-01', 450000.00, 'T015'),
(17, 'Hà Nội', 'Bình Thuận', '2025-07-31', '23:00:00', '2025-08-01', 480000.00, 'T016'),
(18, 'Hà Nội', 'Đồng Nai', '2025-08-01', '00:15:00', '2025-08-01', 520000.00, 'T017'),
(19, 'Hà Nội', 'Bình Dương', '2025-08-01', '01:30:00', '2025-08-01', 540000.00, 'T018'),
(20, 'Hải Phòng', 'Hà Nội', '2025-07-31', '07:00:00', '2025-07-31', 80000.00, 'T019'),
(21, 'Nam Định', 'Hà Nội', '2025-07-31', '08:15:00', '2025-07-31', 95000.00, 'T020'),
(22, 'Ninh Bình', 'Hà Nội', '2025-07-31', '09:30:00', '2025-07-31', 110000.00, 'T021'),
(23, 'Thanh Hóa', 'Hà Nội', '2025-07-31', '10:45:00', '2025-07-31', 130000.00, 'T022'),
(24, 'Vinh', 'Hà Nội', '2025-07-31', '12:00:00', '2025-07-31', 180000.00, 'T023'),
(25, 'Huế', 'Hà Nội', '2025-07-31', '13:15:00', '2025-08-01', 250000.00, 'T024'),
(26, 'Đà Nẵng', 'Huế', '2025-07-31', '08:30:00', '2025-07-31', 120000.00, 'T025'),
(27, 'Huế', 'Đà Nẵng', '2025-07-31', '09:45:00', '2025-07-31', 120000.00, 'T026'),
(28, 'Đà Nẵng', 'Quảng Nam', '2025-07-31', '10:00:00', '2025-07-31', 80000.00, 'T027'),
(29, 'Quảng Nam', 'Đà Nẵng', '2025-07-31', '11:15:00', '2025-07-31', 80000.00, 'T028'),
(30, 'Đà Nẵng', 'Quảng Ngãi', '2025-07-31', '12:30:00', '2025-07-31', 150000.00, 'T029'),
(31, 'Quảng Ngãi', 'Đà Nẵng', '2025-07-31', '13:45:00', '2025-07-31', 150000.00, 'T030'),
(32, 'Đà Nẵng', 'Bình Định', '2025-07-31', '14:00:00', '2025-07-31', 180000.00, 'T031'),
(33, 'Bình Định', 'Đà Nẵng', '2025-07-31', '15:15:00', '2025-07-31', 180000.00, 'T032'),
(34, 'Đà Nẵng', 'Khánh Hòa', '2025-07-31', '16:30:00', '2025-07-31', 250000.00, 'T033'),
(35, 'Khánh Hòa', 'Đà Nẵng', '2025-07-31', '17:45:00', '2025-07-31', 250000.00, 'T034'),
(36, 'Đà Nẵng', 'TP. HCM', '2025-07-31', '18:00:00', '2025-08-01', 400000.00, 'T035'),
(37, 'TP. HCM', 'Đà Nẵng', '2025-07-31', '19:15:00', '2025-08-01', 400000.00, 'T036'),
(38, 'TP. HCM', 'Bình Dương', '2025-07-31', '08:00:00', '2025-07-31', 60000.00, 'T037'),
(39, 'Bình Dương', 'TP. HCM', '2025-07-31', '09:15:00', '2025-07-31', 60000.00, 'T038'),
(40, 'TP. HCM', 'Đồng Nai', '2025-07-31', '10:30:00', '2025-07-31', 80000.00, 'T039'),
(41, 'Đồng Nai', 'TP. HCM', '2025-07-31', '11:45:00', '2025-07-31', 80000.00, 'T040'),
(42, 'TP. HCM', 'Bình Thuận', '2025-07-31', '12:00:00', '2025-07-31', 120000.00, 'T041'),
(43, 'Bình Thuận', 'TP. HCM', '2025-07-31', '13:15:00', '2025-07-31', 120000.00, 'T042'),
(44, 'TP. HCM', 'Ninh Thuận', '2025-07-31', '14:30:00', '2025-07-31', 150000.00, 'T043'),
(45, 'Ninh Thuận', 'TP. HCM', '2025-07-31', '15:45:00', '2025-07-31', 150000.00, 'T044'),
(46, 'TP. HCM', 'Khánh Hòa', '2025-07-31', '16:00:00', '2025-07-31', 200000.00, 'T045'),
(47, 'Khánh Hòa', 'TP. HCM', '2025-07-31', '17:15:00', '2025-07-31', 200000.00, 'T046'),
(48, 'TP. HCM', 'Phú Yên', '2025-07-31', '18:30:00', '2025-07-31', 220000.00, 'T047'),
(49, 'Phú Yên', 'TP. HCM', '2025-07-31', '19:45:00', '2025-07-31', 220000.00, 'T048'),
(50, 'TP. HCM', 'Bình Định', '2025-07-31', '20:00:00', '2025-08-01', 250000.00, 'T049'),
(51, 'Bình Định', 'TP. HCM', '2025-07-31', '21:15:00', '2025-08-01', 250000.00, 'T050'),
(52, 'TP. HCM', 'Quảng Ngãi', '2025-07-31', '22:30:00', '2025-08-01', 280000.00, 'T051'),
(53, 'Quảng Ngãi', 'TP. HCM', '2025-08-01', '00:45:00', '2025-08-01', 280000.00, 'T052'),
(54, 'TP. HCM', 'Quảng Nam', '2025-08-01', '02:00:00', '2025-08-01', 320000.00, 'T053'),
(55, 'Quảng Nam', 'TP. HCM', '2025-08-01', '03:15:00', '2025-08-01', 320000.00, 'T054'),
(56, 'TP. HCM', 'Huế', '2025-08-01', '04:30:00', '2025-08-01', 380000.00, 'T055'),
(57, 'Huế', 'TP. HCM', '2025-08-01', '05:45:00', '2025-08-01', 380000.00, 'T056'),
(58, 'TP. HCM', 'Vinh', '2025-08-01', '06:00:00', '2025-08-01', 450000.00, 'T057'),
(59, 'Vinh', 'TP. HCM', '2025-08-01', '07:15:00', '2025-08-01', 450000.00, 'T058'),
(60, 'TP. HCM', 'Thanh Hóa', '2025-08-01', '08:30:00', '2025-08-01', 480000.00, 'T059'),
(61, 'Thanh Hóa', 'TP. HCM', '2025-08-01', '09:45:00', '2025-08-01', 480000.00, 'T060'),
(62, 'TP. HCM', 'Ninh Bình', '2025-08-01', '10:00:00', '2025-08-01', 500000.00, 'T061'),
(63, 'Ninh Bình', 'TP. HCM', '2025-08-01', '11:15:00', '2025-08-01', 500000.00, 'T062'),
(64, 'TP. HCM', 'Nam Định', '2025-08-01', '12:30:00', '2025-08-01', 520000.00, 'T063'),
(65, 'Nam Định', 'TP. HCM', '2025-08-01', '13:45:00', '2025-08-01', 520000.00, 'T064'),
(66, 'TP. HCM', 'Hải Phòng', '2025-08-01', '14:00:00', '2025-08-01', 550000.00, 'T065'),
(67, 'Hải Phòng', 'TP. HCM', '2025-08-01', '15:15:00', '2025-08-01', 550000.00, 'T066');

-- --------------------------------------------------------

--
-- Table structure for table `nhanvien`
--

CREATE TABLE `nhanvien` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `hoten` varchar(100) NOT NULL,
  `ngaysinh` date NOT NULL,
  `diachi` text NOT NULL,
  `dienthoai` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cccd` varchar(12) NOT NULL,
  `adminQuanLy` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhanvien`
--

INSERT INTO `nhanvien` (`id`, `username`, `password`, `hoten`, `ngaysinh`, `diachi`, `dienthoai`, `email`, `cccd`, `adminQuanLy`) VALUES
(10, 'hanh123', '123456', 'Hiền Anh', '2003-08-19', 'Thái Nguyên', '0967825622', 'hanh208@gmail.com', '982726384', NULL),
(11, 'nhan123', '123456', 'Nhân Trần', '2004-08-10', 'Hà Nội', '0973648422', 'nhantrannuocla@gmail.com', '123939833', NULL),
(12, 'linhkute123', '123456', 'Linh', '2025-01-17', 'Hà Nội', '0973643382', 'linhkute@gmail.com', '1239812121', 1),
(13, 'latrang', '123456', 'Lã Trang', '2025-01-02', 'TP Hồ Chí Minh', '0972625222', 'latrang@gmail.com', '123232112', 1),
(14, 'kllinhhh', '123456', 'Khánh Linh', '2025-01-02', 'TP Hồ Chí Minh', '0287262536', 'klinhtutu@gmail.com', '2132131123', 1),
(15, 'tlongg', '123456', 'Thành Long', '2025-01-02', 'Hà Nội', '0276265522', 'longbaby@gmail.com', '238436453', 1),
(16, 'nana', '123456779', 'Na Na', '2025-01-02', 'Hà Nội', '29873646475', 'nana@gmail.com', '2332467898', 1),
(17, 'bongbaylak', '2385732', 'Bống ', '2019-12-31', 'Ninh Bình', '9083274367', 'bongbaylak@gmail.com', '2385478756', 1),
(18, 'hunggay', '1234567', 'Hùng', '2025-01-02', 'Bình Thuận', '3466878221', 'laugabinhthuan@gmail.com', '354366753', 1),
(20, 'johnqt', '123456', 'John', '2025-01-03', 'Nha Trang', '23213123112', 'johnqt@gmail.com', '233545765675', NULL),
(21, 'mariesan', '1234567', 'Marrie', '2025-01-01', 'Hà Nội', '24336586786', 'mariesan@gmail.com', '2343658765', 1),
(22, 'heloo', '123456', 'Hồng Anh', '2000-06-15', 'Hà Nội', '4354658790', 'heloooo@gmail.com', '5437598790', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ve`
--

CREATE TABLE `ve` (
  `MaVe` int(11) NOT NULL,
  `Toa` int(11) NOT NULL,
  `SoGhe` varchar(10) NOT NULL,
  `LoaiVe` varchar(50) NOT NULL,
  `NgayDi` date NOT NULL,
  `GioDi` time NOT NULL,
  `LichTrinh` int(11) NOT NULL,
  `DonGia` decimal(10,2) NOT NULL,
  `NgayDat` datetime NOT NULL,
  `PhuongThucThanhToan` varchar(50) NOT NULL,
  `MaKH` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ve`
--

INSERT INTO `ve` (`MaVe`, `Toa`, `SoGhe`, `LoaiVe`, `NgayDi`, `GioDi`, `LichTrinh`, `DonGia`, `NgayDat`, `PhuongThucThanhToan`, `MaKH`) VALUES
(1, 2, 'A102', '1 chiều', '0000-00-00', '19:30:10', 2, 120000.00, '2025-01-06 19:42:47', 'VNPAY', NULL),
(2, 2, 'A101', 'Khứ hồi', '2025-07-31', '19:30:10', 1, 100000.00, '2025-03-06 22:21:20', 'VNPAY', NULL),
(3, 2, 'A101', 'Khứ hồi', '2025-07-31', '19:30:10', 3, 450000.00, '2025-03-06 22:51:52', 'VNPAY', NULL),
(4, 2, 'A203', 'Khứ hồi', '2025-06-01', '19:30:10', 4, 100000.00, '2025-03-26 19:28:13', 'VNPAY', NULL),
(5, 2, 'Z203', 'Khứ hồi', '2025-07-31', '19:30:10', 3, 150000.00, '2025-03-26 19:31:02', 'VNPAY', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`Username`);

--
-- Indexes for table `hanhkhach`
--
ALTER TABLE `hanhkhach`
  ADD PRIMARY KEY (`MaKH`),
  ADD UNIQUE KEY `CCCD` (`CCCD`),
  ADD KEY `AdminQuanLy` (`AdminQuanLy`);

--
-- Indexes for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`MaLichTrinh`),
  ADD KEY `GaDi` (`GaDi`),
  ADD KEY `GaDen` (`GaDen`);

--
-- Indexes for table `nhanvien`
--
ALTER TABLE `nhanvien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cccd` (`cccd`);

--
-- Indexes for table `ve`
--
ALTER TABLE `ve`
  ADD PRIMARY KEY (`MaVe`),
  ADD KEY `LichTrinh` (`LichTrinh`),
  ADD KEY `ve_ibfk_1` (`MaKH`);

-- Prevent double-booking: one seat per trip, date, time, carriage
ALTER TABLE `ve`
  ADD UNIQUE KEY `uniq_ve_trip_seat` (`LichTrinh`,`NgayDi`,`GioDi`,`Toa`,`SoGhe`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `hanhkhach`
--
ALTER TABLE `hanhkhach`
  MODIFY `MaKH` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `MaLichTrinh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `nhanvien`
--
ALTER TABLE `nhanvien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `ve`
--
ALTER TABLE `ve`
  MODIFY `MaVe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `hanhkhach`
--
ALTER TABLE `hanhkhach`
  ADD CONSTRAINT `hanhkhach_ibfk_1` FOREIGN KEY (`AdminQuanLy`) REFERENCES `admin` (`Username`) ON DELETE SET NULL;

--
-- Constraints for table `ve`
--
ALTER TABLE `ve`
  ADD CONSTRAINT `ve_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `hanhkhach` (`MaKH`),
  ADD CONSTRAINT `ve_ibfk_2` FOREIGN KEY (`LichTrinh`) REFERENCES `lichtrinh` (`MaLichTrinh`);

-- Optional catalog tables for admin management pages
-- DROP TABLE IF EXISTS `doantau`;
CREATE TABLE IF NOT EXISTS `doantau` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed trains
INSERT INTO `doantau` (`code`, `name`) VALUES
('T001','Metroway 1'),
('T002','Metroway 2'),
('T003','Metroway 3'),
('T004','Express North 1'),
('T005','Express North 2'),
('T006','Express North 3'),
('T007','Express North 4'),
('T008','Express North 5'),
('T009','Express North 6'),
('T010','Express North 7'),
('T011','Express North 8'),
('T012','Express North 9'),
('T013','Express North 10'),
('T014','Express North 11'),
('T015','Express North 12'),
('T016','Express North 13'),
('T017','Express North 14'),
('T018','Express North 15'),
('T019','Express North 16'),
('T020','Express North 17'),
('T021','Express North 18'),
('T022','Express North 19'),
('T023','Express North 20'),
('T024','Express North 21'),
('T025','Express Central 1'),
('T026','Express Central 2'),
('T027','Express Central 3'),
('T028','Express Central 4'),
('T029','Express Central 5'),
('T030','Express Central 6'),
('T031','Express Central 7'),
('T032','Express Central 8'),
('T033','Express Central 9'),
('T034','Express Central 10'),
('T035','Express Central 11'),
('T036','Express Central 12'),
('T037','Express South 1'),
('T038','Express South 2'),
('T039','Express South 3'),
('T040','Express South 4'),
('T041','Express South 5'),
('T042','Express South 6'),
('T043','Express South 7'),
('T044','Express South 8'),
('T045','Express South 9'),
('T046','Express South 10'),
('T047','Express South 11'),
('T048','Express South 12'),
('T049','Express South 13'),
('T050','Express South 14'),
('T051','Express South 15'),
('T052','Express South 16'),
('T053','Express South 17'),
('T054','Express South 18'),
('T055','Express South 19'),
('T056','Express South 20'),
('T057','Express South 21'),
('T058','Express South 22'),
('T059','Express South 23'),
('T060','Express South 24'),
('T061','Express South 25'),
('T062','Express South 26'),
('T063','Express South 27'),
('T064','Express South 28'),
('T065','Express South 29'),
('T066','Express South 30');

-- DROP TABLE IF EXISTS `toatau`;
CREATE TABLE IF NOT EXISTS `toatau` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trainCode` varchar(32) NOT NULL,
  `number` int(11) NOT NULL,
  `type` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainCode` (`trainCode`),
  CONSTRAINT `toatau_train_fk` FOREIGN KEY (`trainCode`) REFERENCES `doantau` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed carriages
INSERT INTO `toatau` (`trainCode`,`number`,`type`) VALUES
('T001',1,'Giường nằm'),
('T001',2,'Ghế mềm'),
('T002',1,'Ghế cứng');

-- DROP TABLE IF EXISTS `ghe`;
CREATE TABLE IF NOT EXISTS `ghe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carriage` varchar(64) NOT NULL,
  `code` varchar(16) NOT NULL,
  `class` varchar(32) NOT NULL,
  `status` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed seats
INSERT INTO `ghe` (`carriage`,`code`,`class`,`status`) VALUES
('T001-1','A1','Phổ thông','available'),
('T001-1','A2','Phổ thông','available'),
('T001-2','B1','Phổ thông','maintenance');

-- DROP TABLE IF EXISTS `tuyen`;
CREATE TABLE IF NOT EXISTS `tuyen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) NOT NULL,
  `from` varchar(64) NOT NULL,
  `to` varchar(64) NOT NULL,
  `distance` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed routes
INSERT INTO `tuyen` (`code`,`from`,`to`,`distance`) VALUES
('HN-DN','Hà Nội','Đà Nẵng',791),
('DN-SG','Đà Nẵng','TP Hồ Chí Minh',963),
('HN-HD','Hà Nội','Hải Dương',57),
('HN-HP','Hà Nội','Hải Phòng',102),
('HN-ND','Hà Nội','Nam Định',87),
('HN-NB','Hà Nội','Ninh Bình',91),
('HN-TH','Hà Nội','Thanh Hóa',153),
('HN-VH','Hà Nội','Vinh',291),
('HN-HUE','Hà Nội','Huế',688),
('HN-QN','Hà Nội','Quảng Nam',791),
('HN-QNG','Hà Nội','Quảng Ngãi',873),
('HN-BD','Hà Nội','Bình Định',1065),
('HN-PY','Hà Nội','Phú Yên',1197),
('HN-KH','Hà Nội','Khánh Hòa',1315),
('HN-NT','Hà Nội','Ninh Thuận',1383),
('HN-BT','Hà Nội','Bình Thuận',1487),
('HN-DN2','Hà Nội','Đồng Nai',1690),
('HN-BD2','Hà Nội','Bình Dương',1710),
('DN-HUE','Đà Nẵng','Huế',103),
('DN-QN','Đà Nẵng','Quảng Nam',60),
('DN-QNG','Đà Nẵng','Quảng Ngãi',142),
('DN-BD','Đà Nẵng','Bình Định',334),
('DN-KH','Đà Nẵng','Khánh Hòa',524),
('DN-SG','Đà Nẵng','TP Hồ Chí Minh',963),
('SG-BD','TP Hồ Chí Minh','Bình Dương',30),
('SG-DN','TP Hồ Chí Minh','Đồng Nai',50),
('SG-BT','TP Hồ Chí Minh','Bình Thuận',198),
('SG-NT','TP Hồ Chí Minh','Ninh Thuận',340),
('SG-KH','TP Hồ Chí Minh','Khánh Hòa',445),
('SG-PY','TP Hồ Chí Minh','Phú Yên',567),
('SG-BD2','TP Hồ Chí Minh','Bình Định',815),
('SG-QNG','TP Hồ Chí Minh','Quảng Ngãi',1005),
('SG-QN','TP Hồ Chí Minh','Quảng Nam',1045),
('SG-HUE','TP Hồ Chí Minh','Huế',1148),
('SG-VH','TP Hồ Chí Minh','Vinh',1580),
('SG-TH','TP Hồ Chí Minh','Thanh Hóa',1640),
('SG-NB','TP Hồ Chí Minh','Ninh Bình',1690),
('SG-ND','TP Hồ Chí Minh','Nam Định',1720),
('SG-HP','TP Hồ Chí Minh','Hải Phòng',1750) ON DUPLICATE KEY UPDATE `from`=VALUES(`from`), `to`=VALUES(`to`), `distance`=VALUES(`distance`);

-- DROP TABLE IF EXISTS `banggia`;
CREATE TABLE IF NOT EXISTS `banggia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `routeCode` varchar(32) NOT NULL,
  `class` varchar(32) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `routeCode` (`routeCode`),
  CONSTRAINT `banggia_tuyen_fk` FOREIGN KEY (`routeCode`) REFERENCES `tuyen` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed price list
INSERT INTO `banggia` (`routeCode`,`class`,`amount`) VALUES
('HN-DN','Phổ thông',550000),
('DN-SG','Phổ thông',650000),
('HN-HD','Phổ thông',90000),
('HN-HP','Phổ thông',120000),
('HN-ND','Phổ thông',140000),
('HN-NB','Phổ thông',150000),
('HN-TH','Phổ thông',200000),
('HN-VH','Phổ thông',350000),
('HN-HUE','Phổ thông',800000),
('HN-QN','Phổ thông',900000),
('HN-QNG','Phổ thông',1000000),
('HN-BD','Phổ thông',1200000),
('HN-PY','Phổ thông',1300000),
('HN-KH','Phổ thông',1400000),
('HN-NT','Phổ thông',1500000),
('HN-BT','Phổ thông',1600000),
('HN-DN2','Phổ thông',1800000),
('HN-BD2','Phổ thông',1900000),
('DN-HUE','Phổ thông',150000),
('DN-QN','Phổ thông',100000),
('DN-QNG','Phổ thông',200000),
('DN-BD','Phổ thông',400000),
('DN-KH','Phổ thông',600000),
('SG-BD','Phổ thông',50000),
('SG-DN','Phổ thông',80000),
('SG-BT','Phổ thông',250000),
('SG-NT','Phổ thông',400000),
('SG-KH','Phổ thông',500000),
('SG-PY','Phổ thông',600000),
('SG-BD2','Phổ thông',900000),
('SG-QNG','Phổ thông',1100000),
('SG-QN','Phổ thông',1200000),
('SG-HUE','Phổ thông',1400000),
('SG-VH','Phổ thông',1800000),
('SG-TH','Phổ thông',1900000),
('SG-NB','Phổ thông',2000000),
('SG-ND','Phổ thông',2100000),
('SG-HP','Phổ thông',2200000);

-- Add password hashing functions
DELIMITER $$
CREATE FUNCTION hash_password(password VARCHAR(255)) 
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    -- Simple hash function (in production, use bcrypt or similar)
    RETURN SHA2(CONCAT(password, 'salt_key_2024'), 256);
END$$
DELIMITER ;

-- Update existing passwords to hashed versions
UPDATE `hanhkhach` SET `Password` = hash_password(`Password`) WHERE CHAR_LENGTH(`Password`) <> 64;
UPDATE `admin` SET `Password` = hash_password(`Password`) WHERE CHAR_LENGTH(`Password`) <> 64;
UPDATE `nhanvien` SET `password` = hash_password(`password`) WHERE CHAR_LENGTH(`password`) <> 64;

-- Add indexes for faster login queries
ALTER TABLE `hanhkhach` ADD INDEX `idx_dienthoai` (`DienThoai`);
ALTER TABLE `hanhkhach` ADD INDEX `idx_email` (`Email`);
ALTER TABLE `hanhkhach` ADD INDEX `idx_cccd` (`CCCD`);
ALTER TABLE `hanhkhach`
  ADD UNIQUE KEY `uniq_hanhkhach_email` (`Email`),
  ADD UNIQUE KEY `uniq_hanhkhach_phone` (`DienThoai`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
