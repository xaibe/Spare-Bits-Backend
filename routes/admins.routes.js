const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/admins.controllers');
const checkAuth = require('../middleware/check-auth');
const upload = require('../config/upload');


router.post("/uploadimage", upload.single('file'), AdminController.uploadAvatar);

router.get("/",AdminController.getAll);
router.post("/login",AdminController.loginUser);
//router.get("/:_id",UserController.getSingleUser);


router.get("/getsingleuser/:email", AdminController.getSingleUser);
router.get("/getsingleuserbyid/:_id", AdminController.getSingleUserbyid);
router.put("/updateuser/:email", AdminController.updateUser);
router.delete("/:_id", AdminController.deleteUser);
router.post("/sendmail", AdminController.SendMail);
router.post("/verifyEmail", AdminController.verifyEmail);
router.post("/updatePassword", AdminController.updatePassword);


module.exports = router;