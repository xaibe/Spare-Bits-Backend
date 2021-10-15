const express = require("express");
const router = express.Router();
const storesController = require('../controllers/stores.controllers');
const checkAuth = require('../middleware/check-auth');
const upload = require('../Config/uploadstore');

router.get("/",checkAuth, storesController.getAll);
router.post("/add",checkAuth, storesController.addStore);
router.delete("/:_id",checkAuth, storesController.deleteStore);
 router.get("/getSingleStore/:_id",checkAuth, storesController.getSingleStore);
router.put("/:_id",checkAuth, storesController.updateProduct);
router.get("/:email",checkAuth, storesController.filtered);
router.post("/uploadimage",checkAuth, upload.array('files',4), storesController.uploadImage);

router.post("/:name",checkAuth, storesController.feedback);
module.exports = router;