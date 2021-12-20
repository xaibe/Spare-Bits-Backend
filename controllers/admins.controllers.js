/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const adminsController = {};
const Users = require("../models/users.model");
const Admins = require("../models/admins.model");
const path = require("path");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const { Console } = require("console");
const config = require("../Config/upload");
var multer = require("multer");
var fs = require("fs");
adminsController.getAll = async (req, res) => {
  let admins;
  try {
    let merged = {};

    admins = await Admins.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: parseInt(start),
        limit: parseInt(length),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: admins,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.getSingleUser = async (req, res) => {
  try {
    const email = req.params.email;
    admin = await Admins.findOne({ email: email });
    if (admin != null) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: admin,
      });
    } else {
      res.status(404).send({
        code: 404,
        message: "Failed",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.getSingleUserbyid = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log("id", _id);
    admin = await Admins.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: admin,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.registerAdmin = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);

    const password = body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    body.password = hash;
    const admin = new Admins(body);

    const result = await admin.save();

    res.send({
      message: "Signup successful",
    });
  } catch (ex) {
    console.log("ex", ex);
    if (ex.code === 11000) {
      res
        .send({
          message: "This email has been registered already",
        })
        .status(500);
    } else {
      res
        .send({
          message: "Error",
          detail: ex,
        })
        .status(500);
    }
  }
};

adminsController.loginUser = async (req, res) => {
  try {
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await Admins.findOne({ email: email });

    const sname = result.name;
    const image = result.avatar;
    const id = result.id;
    console.log("resultname", sname);
    if (!result) {
      // this means result is null
      res.status(406).send({
        Error: "This user doesnot exists. Please signup first",
      });
    } else {
      // email did exist
      // so lets match password

      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access

        result.password = undefined;
        const token = jsonwebtoken.sign(
          {
            data: result,
            role: "Admin",
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );

        res.send({
          message: "Successfully Logged in",
          token: token,
          name: sname,
          avatar: image,
        });
      } else {
        console.log("password doesnot match");

        res.status(401).send({ message: "Wrong email or Password" });
      }
    }
  } catch (ex) {
    console.log("ex", ex);
  }
};

adminsController.getNextId = async (req, res) => {
  try {
    const max_result = await Admin.aggregate([
      { $group: { _id: null, max: { $max: "$id" } } },
    ]);

    let nextId;
    if (max_result.length > 0) {
      nextId = max_result[0].max + 1;
    } else {
      nextId = 1;
    }

    var data = {
      code: 200,
      data: { id: nextId },
    };
    res.status(200).send(data);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.deleteUser = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;

    const result1 = await Admins.findOne({ _id: _id });
    for (let uri of result1.imageUrl) {
      try {
        let filepath = `Public/uploads/` + uri;
        console.log("filepath", filepath);
        fs.unlinkSync(filepath);
      } catch (error) {
        console.log("error", error);
      }
    }
    // eslint-disable-next-line no-unused-vars
    const result = await Admins.findOneAndDelete({
      _id: _id,
    });
    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.updatePassword = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const uemail = body.email;
    const upassword = body.password;
    console.log("remail", uemail);
    console.log("upassword", upassword);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(upassword, salt);
    console.log("passwordhash", hash);

    const result = await Admins.findOne({ email: uemail });

    if (!result) {
      // this means result is null
      res.status(400).send({
        code: 400,
        message: "This user doesnot exists. Please signup first",
      });
    } else {
      try {
        const _id = result._id;
        console.log(_id);
        const updates = {
          password: hash,
        };
        runUpdate(_id, updates, res);
      } catch (error) {
        console.log("error for trying save in db", error);
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.verifyEmail = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const uemail = body.email;
    const userVCode = body.verificationcode;
    console.log("remail", uemail);
    console.log("userVCode", userVCode);
    //console.log('verifycode',verifyCode);

    const result = await Admins.findOne({ email: uemail });
    const dbvCode = result.verifycode;
    if (!result) {
      // this means result is null
      res.status(401).send({
        code: 401,
        message: "This user doesnot exists. Please signup first",
      });
    } else {
      if (userVCode == dbvCode) {
        console.log("dbcode", dbvCode);
        console.log("match found");
        res.status(200).send({
          code: 200,
          message: "The user is Successfully",
        });
      } else {
        console.log("cant find any match");
        res.status(420).send({
          code: 420,
          message: "Wrong verification code entered",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.uploadAvatar = async (req, res) => {
  try {
    const body = req.file;
    console.log("body", body);

    const ext = path.extname(req.file.originalname);
    const name = req.file.originalname;
    var email = req.file.originalname;

    email = email.substring(14, email.length - 5);
    console.log("name", email);

    const filePath = name;
    console.log("filepath", filePath);
    console.log("extension", ext);

    const updates = {
      avatar: filePath,
      avatar_ext: ext,
      imageUrl: filePath,
    };
    runUpdateById(email, updates, res);
    //runUpdateById(req.params.id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

adminsController.updateUser = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const rname = body.name;
    const rnum = body.mnumber;
    const uemail = req.params.email;
    console.log("remail", uemail);
    const mail = body.email;
    console.log("mail", mail);
    if (mail === uemail || mail === null || mail === undefined) {
      delete body.email;
    }

    //console.log('verifycode',verifyCode);

    const result = await Admins.findOne({ email: uemail });

    const name = result.name;
    const num = result.mnumber;
    if (rname === name || rname === null || rname === undefined) {
      delete body.name;
    } else if (rnum === num || num === null || num === undefined) {
      delete body.mnumber;
    }

    const _id = result._id;
    console.log("id", _id);
    if (!result) {
      res.status(500).send({
        message: "email missing",
      });
    } else {
      try {
        let updates = body;
        runUpdate(_id, updates, res);
      } catch (error) {
        console.log("update error", error);
        return res.status(500).send(error);
      }
    }
  } catch (error) {
    console.log("overall error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Admins.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: "Created Successfully",
        });
      } else {
        res.status(422).send({
          code: 422,
          message: "Unprocessible Entity",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}
async function runUpdateById(email, updates, res) {
  try {
    const result = await Admins.updateOne(
      {
        email: email,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: "Created Successfully",
      });
    } else {
      {
        res.status(200).send({
          code: 200,
          message: "Task completed successfully",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}
adminsController.SendMail = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const email = body.email;

    var verifyCode = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    console.log(verifyCode);

    //var RandomNumber=Math.floor(Math.random()*10000);
    //SSSconsole.log(RandomNumber);

    const result = await Admins.findOne({ email: email });
    console.log("admin found before email for sending verify code", result);
    if (!result) {
      // this means result is null
      res.status(400).send({
        Error: "This user doesnot exists. Please signup first",
        message: "This user doesnot exists. Please signup first",
      });
    } else {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sparebits1@gmail.com",
          pass: "Jiyan@786",
        },
      });
      var mailOptions = {
        from: "SpareBits3217@gmail.com",
        to: email,
        subject: "Password Recovery Spare Bits",
        html: `<h1>Hello! Need to reset your password?</h1><p>Thanks a lot for using Spare Bits!   </p> 
              
              <p>Use this verification code to reset your password: ${verifyCode}</p>

              <h2>regards:</h2> <p>Spare Bits</p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          //res.send({ message: 'we got a problem' });
        } else {
          console.log("Email sent: " + info.response);

          // res.send({ message: 'Verify Code saved to db succesfully!' });
          try {
            const _id = result._id;
            console.log(_id);
            const updates = {
              verifycode: verifyCode,
            };

            runUpdate(_id, updates, res);
          } catch (error) {
            console.log("error for trying save in db", error);
          }
        }
      });
    }
  } catch (ex) {
    console.log("ex", ex);
  }
};

module.exports = adminsController;
