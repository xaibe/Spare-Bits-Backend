const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/products.controllers");
const checkAuth = require("../middleware/check-auth");
const upload = require("../Config/uploadproduct");

router.get("/", checkAuth, ProductsController.getAll);
router.post("/add", checkAuth, ProductsController.addProduct);
router.delete("/:_id", checkAuth, ProductsController.deleteProduct);
router.get("/filterbyid/:_id", checkAuth, ProductsController.getSingleProduct);
router.put("/:_id", checkAuth, ProductsController.updateProduct);
router.get("/:email", checkAuth, ProductsController.filtered);
router.get(
  "/filterbystore/:_id",
  checkAuth,
  ProductsController.filterbystore_id
);
router.post(
  "/uploadimage/:_id",
  checkAuth,
  upload.array("files", 4),
  ProductsController.uploadImage
);

router.post("/feedback/:_id", checkAuth, ProductsController.feedback);
module.exports = router;
