const express = require("express");
const router = express.Router();
const OrdersController = require("../controllers/orders.controllers");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, OrdersController.getAll);
router.post("/add", checkAuth, OrdersController.addOrderCOD);
router.post(
  "/Updateorderafterpayment/:_id",
  checkAuth,
  OrdersController.UpdateOrderAfterpayment
);
router.post("/ConfirmPayment", checkAuth, OrdersController.ConfirmPayment);
router.delete("/:_id", checkAuth, OrdersController.deleteOrder);
// router.get("0/:_id",checkAuth, OrdersController.getSingleProduct);
router.put("/:_id", OrdersController.updateOrder);
router.put("/confirmorder/:_id", OrdersController.confirmOrder);
router.put("/cancelorder/:_id", OrdersController.cancelOrder);
router.put("/confirmorderdelivery/:_id", OrdersController.confirmOrderDelivery);
router.put("/cancelorderdelivery/:_id", OrdersController.cancelOrderDelivery);
router.get("/:_id", checkAuth, OrdersController.filtered);
router.get(
  "/checkOrderPaymentStatus/:id",
  checkAuth,
  OrdersController.CheckOrderPaymentStatus
);
router.get(
  "/filterbuyerorder/:email",
  checkAuth,
  OrdersController.filteredbybuyeremail
);
router.get(
  "/filterbyproid/:_id",
  checkAuth,
  OrdersController.filterbyproductid
);
router.get(
  "/filterbyproduct/:name",
  checkAuth,
  OrdersController.filterbyproductname
);
router.get(
  "/filtersellerorder/:email",
  checkAuth,
  OrdersController.filteredbyselleremail
);
//router.post("/uploadimage",checkAuth, upload.array('files',4),OrdersController.uploadImage);

//router.post("/:name",checkAuth, ProductsController.feedback);
module.exports = router;
