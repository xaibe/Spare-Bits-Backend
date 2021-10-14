const express = require("express");
const router = express.Router();
const OrdersController = require('../controllers/orders.controllers');
const checkAuth = require('../middleware/check-auth');
const upload = require('../config/uploadproduct');

router.get("/",checkAuth, OrdersController.getAll);
router.post("/add",checkAuth, OrdersController.addOrder);
router.delete("/:_id",checkAuth,OrdersController.deleteOrder);
// router.get("0/:_id",checkAuth, OrdersController.getSingleProduct);
router.put("/:_id", OrdersController.updateOrder);
router.put("/confirmorder/:_id", OrdersController.confirmOrder);
router.put("/cancelorder/:_id", OrdersController.cancelOrder);
router.put("/confirmorderdelivery/:_id", OrdersController.confirmOrderDelivery);
router.put("/cancelorderdelivery/:_id", OrdersController.cancelOrderDelivery);
router.get("/:_id",checkAuth, OrdersController.filtered);
router.get("/filterbuyerorder/:email",checkAuth,OrdersController.filteredbybuyeremail);
router.get("/filterbyproid/:_id",checkAuth,OrdersController.filterbyproductid);
router.get("/filterbyproduct/:name",checkAuth,OrdersController.filterbyproductname);
router.get("/filtersellerorder/:email",checkAuth,OrdersController.filteredbyselleremail);
//router.post("/uploadimage",checkAuth, upload.array('files',4),OrdersController.uploadImage);

//router.post("/:name",checkAuth, ProductsController.feedback);
module.exports = router;