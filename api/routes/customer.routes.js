const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

// Define routes
// routes for Customer
router.get('/all', customerController.getAllCustomers);
router.get('/detail', customerController.getCustomerById);
router.post('/', customerController.addCustomer);
router.put('/update', customerController.updateCustomer);

router.delete('/delete', customerController.deleteCustomer);

router.post('/uploadfile', customerController.uploadfileCustomer);
module.exports = router;