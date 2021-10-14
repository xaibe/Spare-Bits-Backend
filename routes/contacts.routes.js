const express = require("express");
const router = express.Router();
const ContactsController = require('../controllers/contacts.controllers');
const checkAuth = require('../middleware/check-auth');
const upload = require('../config/uploadproduct');

router.get("/",checkAuth, ContactsController.getAll);
 router.post("/add",checkAuth, ContactsController.createContact);
 router.put("/:_id",checkAuth, ContactsController.updateMessages);
 router.delete("/:_id",checkAuth, ContactsController.deleteContact);
//  router.get("0/:_id",checkAuth, ProductsController.getSingleProduct);
// router.put("/:_id",checkAuth, ProductsController.updateProduct);
// router.get("/:email",checkAuth, ProductsController.filtered);
// router.post("/uploadimage",checkAuth, upload.array('files',4), ProductsController.uploadImage);

// router.post("/:name",checkAuth, ProductsController.feedback);
module.exports = router;