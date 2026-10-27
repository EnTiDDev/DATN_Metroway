const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');
const request = require('request');
const config = require('config');
const { sortObject } = require('../services/vnpay.service');

function renderOrderList(req, res){
  res.render('orderlist', { title: 'Danh sách đơn hàng' });
}

function renderCreatePayment(req, res){
  const amount = req?.query?.amount;
  res.render('order', { title: 'Thanh toán giao dịch', amount });
}

function renderQuery(req, res){
  res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
}

function renderRefund(req, res){
  res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
}

function buildClientIp(req){
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket && req.connection.socket.remoteAddress);
}

function createPaymentUrl(req, res){
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const ipAddr = buildClientIp(req);

  const tmnCode = config.get('vnp_TmnCode');
  const secretKey = config.get('vnp_HashSecret');
  let vnpUrl = config.get('vnp_Url');
  const returnUrl = config.get('vnp_ReturnUrl');
  const orderId = moment(date).format('DDHHmmss');
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;
  let locale = req.body.language || 'vn';
  const currCode = 'VND';

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
  res.redirect(vnpUrl);
}

function vnpayReturn(req, res){
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  vnp_Params = sortObject(vnp_Params);

  const secretKey = config.get('vnp_HashSecret');
  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    return res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
  }
  return res.render('success', { code: '97' });
}

function vnpayIpn(req, res){
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];
  const orderId = vnp_Params['vnp_TxnRef'];
  const rspCode = vnp_Params['vnp_ResponseCode'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  vnp_Params = sortObject(vnp_Params);
  const secretKey = config.get('vnp_HashSecret');
  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');

  const paymentStatus = '0';
  const checkOrderId = true;
  const checkAmount = true;
  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === '0') {
          if (rspCode === '00') {
            return res.status(200).json({ RspCode: '00', Message: 'Success' });
          }
          return res.status(200).json({ RspCode: '00', Message: 'Success' });
        }
        return res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
      }
      return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
    }
    return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
  }
  return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
}

function queryDr(req, res){
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const vnp_TmnCode = config.get('vnp_TmnCode');
  const secretKey = config.get('vnp_HashSecret');
  const vnp_Api = config.get('vnp_Api');

  const vnp_TxnRef = req.body.orderId;
  const vnp_TransactionDate = req.body.transDate;
  const vnp_RequestId = moment(date).format('HHmmss');
  const vnp_Version = '2.1.0';
  const vnp_Command = 'querydr';
  const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
  const vnp_IpAddr = buildClientIp(req);
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
  const data = [vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode, vnp_TxnRef, vnp_TransactionDate, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo].join('|');
  const vnp_SecureHash = crypto.createHmac('sha512', secretKey).update(Buffer.from(data, 'utf-8')).digest('hex');
  const body = { vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode, vnp_TxnRef, vnp_OrderInfo, vnp_TransactionDate, vnp_CreateDate, vnp_IpAddr, vnp_SecureHash };
  request({ url: vnp_Api, method: 'POST', json: true, body }, function (error, response, bodyResp) {
    console.log(response && response.statusCode);
    res.json({ ok: true });
  });
}

function refund(req, res){
  res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
}

module.exports = {
  renderOrderList,
  renderCreatePayment,
  renderQuery,
  renderRefund,
  createPaymentUrl,
  vnpayReturn,
  vnpayIpn,
  queryDr,
  refund,
};


