const pool = require('../config/db');
const Ticket = require('../models/ticket.model');

async function booking(req, res) {
  try {
    // Support multiple seats separated by comma
    const seatList = String(req.body.seat || '').split(',').map(s => s.trim()).filter(Boolean);
    if (seatList.length <= 1) {
      // Guard: prevent double booking at DB level by checking current booked seats
      const booked = await Ticket.listBookedSeats(pool, {
        route: req.body.route,
        departureDate: req.body.departureDate,
        time: req.body.time,
        carriage: req.body.carriage,
      });
      const set = new Set((booked || []).map(r => r.SoGhe));
      if (set.has(req.body.seat)) return res.status(409).json({ message: 'Ghế đã có người đặt' });
      await Ticket.create(pool, req.body);
    } else {
      // insert each seat as one ticket, skip seats already booked
      const booked = await Ticket.listBookedSeats(pool, {
        route: req.body.route,
        departureDate: req.body.departureDate,
        time: req.body.time,
        carriage: req.body.carriage,
      });
      const set = new Set((booked || []).map(r => r.SoGhe));
      // Deduplicate requested seats and filter out those already booked
      const seatsToInsert = Array.from(new Set(seatList)).filter(s => !set.has(s));
      if (seatsToInsert.length === 0) return res.status(409).json({ message: 'Ghế đã có người đặt' });
      for (const s of seatsToInsert) {
        await Ticket.createSingle(pool, { ...req.body, price: req.body.price, seatClass: req.body.seatClass }, s);
      }
    }
    res.status(201).json({ message: 'Ticket booked successfully' });
  } catch (e) {
    // Duplicate key safety (unique constraint on trip+seat)
    if (e && (e.code === 'ER_DUP_ENTRY' || e.errno === 1062)) {
      return res.status(409).json({ message: 'Ghế đã có người đặt' });
    }
    res.status(500).json({ message: e.message });
  }
}

async function myTickets(req, res) {
  try {
    const { maKh } = req.query;
    if (!maKh) return res.status(400).json({ message: 'Missing maKh' });
    const rows = await Ticket.listByCustomer(pool, maKh);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function adminList(req, res) {
  try {
    const rows = await Ticket.listAll(pool);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function cancel(req, res) {
  try {
    await Ticket.deleteIfCash(pool, req.params.id);
    res.json({ success: true });
  } catch (e) {
    const code = /online/i.test(e.message) ? 400 : 500;
    res.status(code).json({ message: e.message });
  }
}

async function adminCancel(req, res) {
  try {
    // Lấy thông tin vé trước khi xóa để trả về thông tin chi tiết
    const ticketInfo = await pool.query('SELECT MaVe, PhuongThucThanhToan, MaKH FROM ve WHERE MaVe = ?', [req.params.id]);
    if (!ticketInfo || ticketInfo.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy vé' });
    }
    
    const ticket = ticketInfo[0];
    await Ticket.deleteByAdmin(pool, req.params.id);
    
    let message = 'Vé đã được hủy thành công';
    if (ticket.PhuongThucThanhToan?.toUpperCase() === 'VNPAY') {
      message += ' (Vé thanh toán VNPAY)';
    }
    
    res.json({ 
      success: true, 
      message,
      ticketId: ticket.MaVe,
      paymentMethod: ticket.PhuongThucThanhToan
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = { booking, myTickets, adminList, cancel, adminCancel };

async function bookedSeats(req, res){
  try{
    const rows = await Ticket.listBookedSeats(pool, req.query);
    res.json(rows);
  }catch(e){ res.status(500).json({ message: e.message }); }
}

module.exports.bookedSeats = bookedSeats;


