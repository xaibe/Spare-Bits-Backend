/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const usersController = {};
const Orders = require("../models/orders.model");
const productsController = {};
const Contacts = require("../models/contacts.model");
const Stores = require("../models/stores.model");
const Products = require("../models/products.model");
const Users = require("../models/users.model");
const path = require("path");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const { Console } = require("console");
const config = require("../Config/upload");
var multer = require("multer");
var fs = require("fs");

usersController.getAll = async (req, res) => {
  console.log("USERS ");
  try {
    let merged = {};
    const start = 0;
    const length = 500;

    const users = await Users.find().limit(length);
    console.log(users.length);
    console.log(users);
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
usersController.getSingleUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Users.findOne({ email: email });
    if (user != null) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
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

usersController.getSingleUserbyid = async (req, res) => {
  try {
    const _id = req.params._id;
    console.log("id", _id);
    const user = await Users.findOne({ _id: _id });
    if (user != null) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: user,
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

usersController.retrieveAvatar = async (req, res) => {
  try {
    var avtar = req.params.avatar;
    avtar = "./uploads/" + avtar;
    avtar = avtar.split(" ").join("");
    console.log("got something", avtar);

    res.download(avtar);

    console.log("got something");
    // res.status(200).send({
    //     code: 200,
    //     message: 'Successful',
    //     data: user
    // });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.registerUser = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);

    // fahad code for image
    //const filePath = `uploads/${req./*params.*/file.originalname}`;
    //const ext = path.extname(req.file.originalname);
    //body.imageUrl = filePath;
    //body.imageExt =  ext;
    // console.log(body.avatar);
    //console.log(body.imageUrl);
    // there must be a password in body

    // we follow these 2 steps

    const password = body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    body.password = hash;
    const user = new Users(body);

    const result = await user.save();
    console.log("result", result);
    const sname = result.name;
    const id = result._id;
    const semail = result.email;
    if (result) {
      result.password = undefined;
      const token = jsonwebtoken.sign(
        {
          data: result._id,
          role: "User",
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );
      res.send({
        message: "Signup successful",
        token: token,
        name: sname,
        email: semail,
        userid: id,
      });
    }
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

usersController.loginUser = async (req, res) => {
  try {
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await Users.findOne({ email: email });

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
            data: result.id,
            role: "User",
          },
          process.env.JWT_KEY,
          { expiresIn: "1d" }
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

usersController.getNextId = async (req, res) => {
  try {
    const max_result = await Users.aggregate([
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

usersController.deleteUser = async (req, res) => {
  if (!req.params._id) {
    // eslint-disable-next-line no-undef
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;

    const result1 = await Users.findOne({ _id: _id });

    if (result1.imageUrl === null || result1.imageUrl === undefined) {
      console.log("no image");
    } else {
      try {
        let filepath = `Public/uploads/` + result1.imageUrl;
        console.log("filepath", filepath);
        fs.unlinkSync(filepath);
      } catch (error) {
        console.log("error", error);
      }
    }

    const result = await Users.findOneAndDelete({
      _id: _id,
    });

    console.log("result", result);
    const result2 = await Products.findOneAndDelete({
      email: result1.email,
    });

    const result3 = await Stores.findOneAndDelete({
      email: result1.email,
    });

    const result4 = await Contacts.deleteMany({
      user_id: _id,
    });

    const result5 = await Contacts.deleteMany({
      contacted_userid: _id,
    });

    return res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

usersController.updatePassword = async (req, res) => {
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

    const result = await Users.findOne({ email: uemail });

    if (!result) {
      // this means result is null
      res.status(401).send({
        code: 401,
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

usersController.verifyEmail = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const uemail = body.email;
    const userVCode = body.verificationcode;
    console.log("remail", uemail);
    console.log("userVCode", userVCode);
    //console.log('verifycode',verifyCode);

    const result = await Users.findOne({ email: uemail });
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
          message: "The user is Successfully Verified",
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

usersController.uploadAvatar = async (req, res) => {
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

usersController.updateUser = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const uemail = body.email;
    console.log("remail", uemail);
    //console.log('verifycode',verifyCode);

    const result = await Users.findOne({ email: uemail });
    const _id = result._id;
    console.log("id", _id);
    if (!result) {
      res.status(500).send({
        message: "email missing",
      });
    } else {
      try {
        let updates = req.body;
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

usersController.updateName = async (req, res) => {
  try {
    const name = req.body.name;
    console.log("name", name);
    const uemail = req.params.email;
    console.log("remail", uemail);

    try {
      let updates = {
        sellername: name,
      };
      const update = {
        sellerName: name,
      };
      // eslint-disable-next-line no-unused-vars
      const result = await Products.updateMany(
        {
          email: uemail,
        },
        {
          $set: updates,
        },
        {
          runValidators: true,
        }
      );
      console.log("results after updating name in products", result);
      console.log("results ok", result.ok);
      if (result.ok === 1) {
        const result2 = await Orders.updateMany(
          {
            ordertoemail: uemail,
          },
          {
            $set: update,
          },
          {
            runValidators: true,
          }
        );
        console.log("results after updating name in orders", result2);
        if (result2.ok === 1) {
          console.log(" entered first response");
          return res.status(200).send({
            code: 200,
            message: "Updated Successfully",
          });
        } else {
          return res.status(408).send({
            code: 408,
            message: "Updated failed in orders",
          });
        }
      } else {
        return res.status(422).send({
          code: 422,
          message: "Unprocessible Entity",
        });
      }
    } catch (error) {
      console.log("error for updating stock", error);
    }
    //   const sellername = body.name;
    //     const result = await Users.findOne({ email: uemail });
    //   const _id = //result._id;
    //   console.log("id", _id);
    //   if (!result) {
    //     res.status(500).send({
    //       message: "email missing",
    //     });
    //   } else {
    //     try {
    //       let updates = req.body;
    //       runUpdate(_id, updates, res);
    //     } catch (error) {
    //       console.log("update error", error);
    //       return res.status(500).send(error);
    //     }
    //   }
  } catch (error) {
    console.log("overall error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Users.updateOne(
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
    const result = await Users.updateOne(
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

async function runUpdateProductsManyByEmail(email, updates, res) {
  try {
    const result = await Products.updateMany(
      {
        email: email,
      },
      {
        $set: updates,
      },
      {
        runValidators: true,
      }
    );

    if (result.nModified == 1) {
      true;
    } else {
      true;
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

usersController.sendNewUserMail = async (req, res) => {
  try {
    const body = req.body;
    console.log("req.body", body);
    const email = body.email;

    var verifyCode = body.verifycode;
    console.log(verifyCode);

    //var RandomNumber=Math.floor(Math.random()*10000);
    //SSSconsole.log(RandomNumber);

    const result = await Users.findOne({ email: email });
    console.log("user found before email for sending verify code", result);
    if (result) {
      // this means result is not null
      res.status(400).send({
        Error: "This user already exists.",
        message: "This user already exists. ",
      });
    } else {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.user,
          pass: process.env.pass,
        },
      });
      var mailOptions = {
        from: "SpareBits3217@gmail.com",
        to: email,
        subject: "Email Verification Spare Bits",
        html: `<h1>Hello! You Have to verify your Email Adress to complete Signup on Spare Bits.</h1><p>Thanks a lot for using Spare Bits!   </p> 
              
              <p>Use this verification code to Verify your Email Address: ${verifyCode}</p>

              <h2>regards:</h2> <p>Spare Bits</p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).send({
            Error: 400,
            message: "Can't send email please try again",
          });

          //res.send({ message: 'we got a problem' });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send({
            code: 200,
            message: "Email Delivered Sucessfully",
          });
        }
      });
    }
  } catch (ex) {
    console.log("ex", ex);
  }
};

usersController.SendMail = async (req, res) => {
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

    const result = await Users.findOne({ email: email });
    console.log("user found before email for sending verify code", result);
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
          user: process.env.user,
          pass: process.env.pass,
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
          res.status(400).send({
            Error: 400,
            message: "Can't send email please try again",
          });
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

module.exports = usersController;
