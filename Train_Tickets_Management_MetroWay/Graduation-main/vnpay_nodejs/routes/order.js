/**
 * Created by CTT VNPAY
 */



let express = require('express');
let router = express.Router();
const ctrl = require('../controllers/order.controller');


router.get('/', ctrl.renderOrderList);

router.get('/create_payment_url', ctrl.renderCreatePayment);

router.get('/querydr', ctrl.renderQuery);

router.get('/refund', ctrl.renderRefund);


router.post('/create_payment_url', ctrl.createPaymentUrl);

router.get('/vnpay_return', ctrl.vnpayReturn);

router.get('/vnpay_ipn', ctrl.vnpayIpn);

router.post('/querydr', ctrl.queryDr);

router.post('/refund', ctrl.refund);

module.exports = router;