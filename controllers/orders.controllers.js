/* eslint-disable no-unused-labels */
/* eslint-disable no-unused-vars */
const ordersController = {};
const Users = require("../models/users.model");
const Orders = require("../models/orders.model");
var nodemailer = require("nodemailer");
const Products = require("../models/products.model");
const bSecure = require("bsecure");

const config = {
  client_id: process.env.client_id,
  client_secret: process.env.client_secret,
  environment: process.env.environment,
};
let bsecure = new bSecure(config);
console.log(config);
bsecure
  .authorize()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));

//to send all orders to the backend
ordersController.getAll = async (req, res) => {
  let orders;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    orders = await Orders.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//filter all the orders by buyer email
ordersController.filteredbybuyeremail = async (req, res) => {
  let orders = [];

  const email = req.params.email;
  console.log("email", email);

  try {
    orders = await Orders.find({ orderbyemail: email });
    console.log("orders", orders);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//filter all the orders by seller email
ordersController.filteredbyselleremail = async (req, res) => {
  let orders = [];

  const email = req.params.email;
  console.log("email", email);

  try {
    orders = await Orders.find({ ordertoemail: email });
    console.log("orders", orders);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//make confirm Order variable to true so the buyer get notified
ordersController.confirmOrderDelivery = async (req, res) => {
  try {
    const body = req.body;
    const _id = req.params._id;

    const Delivered = body.Delivered;
    console.log("Delivered", Delivered);
    console.log("id", _id);

    const updates = { Delivered: Delivered };
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//make cancel order delivery variable to true so the buyer will get notified
ordersController.cancelOrderDelivery = async (req, res) => {
  try {
    const body = req.body;
    const _id = req.params._id;
    const cancel = body.cancel;
    const Delivered = body.Delivered;
    console.log("cancel", cancel);
    console.log("id", _id);
    const updates = { cancelled: cancel, Delivered: Delivered };
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//make confirm order variable to true so the buyer will get notified

ordersController.confirmOrder = async (req, res) => {
  try {
    const body = req.body;
    const _id = req.params._id;

    const confirm = body.confirm;
    console.log("confirm", confirm);
    console.log("id", _id);

    const updates = { confirm: confirm };
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//make cancel order variable to true so the buyer will get notified
ordersController.cancelOrder = async (req, res) => {
  try {
    const body = req.body;
    const _id = req.params._id;
    const cancel = body.cancel;
    console.log("cancel", cancel);
    console.log("id", _id);
    const updates = { cancelled: cancel };
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//filter orders using id
ordersController.filtered = async (req, res) => {
  let orders = [];

  const _id = req.params._id;
  console.log("id", _id);

  try {
    orders = await Orders.find({ _id: _id });
    console.log("orders", orders);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//filter orders using product id
ordersController.filterbyproductid = async (req, res) => {
  let orders = [];

  const _id = req.params._id;
  console.log("id", _id);

  try {
    orders = await Orders.find({ productid: _id });
    console.log("orders", orders);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//filter orders using product name
ordersController.filterbyproductname = async (req, res) => {
  let orders = [];

  const name = req.params.name;
  console.log("name", name);

  try {
    orders = await Orders.find({ productname: name });
    console.log("orders", orders);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

ordersController.ConfirmPayment = async (req, res) => {
  console.log("entered Confirm");
  let user;
  const body = req.body;
  console.log("order body", body);
  const buyeremail = body.orderbyemail;
  const img = "https://sparebits.herokuapp.com//uploadproduct//";
  const proPrice = body.TotalAmount / body.productCount;
  let total = body.TotalAmount - body.discount;
  total = parseFloat(total).toFixed(2);
  //total = total + 0.0;
  let sub_total = parseFloat(body.TotalAmount).toFixed(2);
  console.log("total", total, "subtotal", sub_total);
  const productname = body.productname;
  const productCont = body.productCount;
  let ship_Charge = 200;
  let ship_Method = "TCS";

  try {
    // eslint-disable-next-line no-unused-vars
    user = await Users.find({ email: buyeremail });
  } catch (err) {
    console.log("error while getting user", err);
    throw new err();
  }
  let product = [
    {
      id: body.productid,
      name: body.productname,
      sku: "product-sku",
      quantity: body.productCount,
      price: proPrice,
      sale_price: proPrice,
      image: img + body.mainimage,
      description: "product-description",
      short_description: "",
    },
  ];

  var shipment = {
    charges: ship_Charge,
    method_name: ship_Method,
  };

  var customer = {
    name: user.name,
    email: user.email,
    country_code: "+92",
    phone_number: user.mnumber,
  };

  var order_charge = {
    sub_total: sub_total,
    discount: body.discount,
    total: total,
  };

  let orders = new Orders(body);
  const result = await orders.save();
  let resultid = result._id;

  (async () => {
    try {
      console.log("entered try Confirm");
      let order = bsecure.Order;
      order.setOrderId(resultid);
      order.setCharges(order_charge);
      order.setCustomer(customer);
      order.setCartItems(product);
      order.setShipmentDetails(shipment);
      let confirm = await order.createOrder();
      if (confirm.status === 200) {
        console.log("result", confirm);
        return res
          .send({
            message: "Payment Confirmed successfully",
            result: confirm,
            orderid: resultid,
          })
          .status(200);
      }
    } catch (err) {
      throw new Error(err);
    }
  })();
};

//create new orders
ordersController.addOrder = async (req, res) => {
  // eslint-disable-next-line no-unused-labels

  let products = [];
  let resultid;
  let orders;
  try {
    const body = req.body;
    console.log("order body", body);
    const buyeremail = body.orderbyemail;
    const selleremail = body.ordertoemail;
    const productname = body.productname;
    const productCont = body.productCount;

    orders = new Orders(body);

    try {
      const result = await orders.save();
      resultid = result._id;
      console.log("Order created", result);
      var obj = { _id: result._id, orderbyemail: buyeremail };
      var obj2 = { _id: result._id, ordertoemail: selleremail };

      //substracting product stock
      try {
        let prodd;
        let existingstock;
        let elementid;
        let newstock;
        products = await Products.find({ name: productname });
        console.log("products", products);

        prodd = products.filter((e) => e.email == selleremail);
        console.log("products", prodd);

        prodd.forEach((element) => {
          existingstock = element.stock;
          elementid = element._id;
        });
        newstock = existingstock - productCont;
        console.log("newstock", newstock);
        if (newstock < 0) {
          return res.status(420).send({
            messag:
              "Error Not enough stock in inventory please decrease item number and try again",
          });
        } else {
          try {
            const updates = {
              stock: newstock,
            };
            // eslint-disable-next-line no-unused-vars
            const result = await Products.updateOne(
              {
                _id: elementid,
              },
              {
                $set: updates,
              },
              {
                upsert: true,
                runValidators: true,
              }
            );
          } catch (error) {
            console.log("error for updating stock", error);
          }
        }

        try {
          const users = await Users.find({ email: selleremail });
          await Users.updateOne(
            { email: selleremail },
            {
              $push: {
                Orderrecieved: obj,
              },
            }
          );

          console.log("Users", users);

          try {
            // eslint-disable-next-line no-unused-vars
            const users = await Users.find({ email: buyeremail });
            Users.updateOne(
              { email: buyeremail },
              {
                $push: {
                  myorder: obj2,
                },
              }
            );

            //sending email
            try {
              SendMailtobuyer(buyeremail, result._id, productname);
              SendMailtoseller(selleremail, result._id, productname);
            } catch (error) {
              console.log("error for trying to send email", error);
            }
          } catch (ex) {
            console.log("error in saving my order", ex);
          }
        } catch (ex) {
          console.log("error saving order recieved", ex);
        }
      } catch (error) {
        console.log("error while substracting stock", error);
      }
    } catch (ex) {
      console.log("ex", ex);
    }
    return res
      .send({
        message: "Order Created successfully",
        _id: resultid,
      })
      .status(200);

    //res.status(200).end();
  } catch (ex) {
    console.log("ex", ex);
    if (ex.code === 11000) {
      return res
        .send({
          message: "This product has been ordered already",
        })
        .status(500);
    } else {
      return res
        .send({
          message: "Error",
          detail: ex,
        })
        .status(500);
    }
  }
};

//delete orders
ordersController.deleteOrder = async (req, res) => {
  if (!req.params._id) {
    // eslint-disable-next-line no-undef
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;

    const result = await Orders.findOneAndDelete({
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
//update orders
ordersController.updateOrder = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;

    console.log("updates", updates);
    console.log("id", _id);
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
//update orders by id
async function runUpdate(_id, updates, res) {
  try {
    const result = await Orders.updateOne(
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

async function runUpdateByName(name, updates, res) {
  try {
    const result = await Orders.updateOne(
      {
        name: name,
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
      res.status(201).send({
        code: 201,
        message: "Updated Successfully",
      });
    } else if (result.upserted) {
      res.status(203).send({
        code: 203,
        message: "Created Successfully",
      });
    } else {
      {
        res.status(202).send({
          code: 202,
          message: "Task completed successfully",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

async function SendMailtoseller(email, ordernum, proname) {
  try {
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
      subject: "Order Confirmation By SPARE BITS",
      html: `<h1>Hello! This is the Confirmation Email By Spare Bits for the product order ${proname}</h1>
                <h1>Your Order number is  # ${ordernum}  </h1>
                <h1>You will have to send this order to the buyer in the next two working days </h1>
                <h2>Please Check the app for more details </h2>
                <p> Thanks a lot for using Spare Bits!   </p> 
                
                <h2>regards:</h2> <p>Spare Bits</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        //res.send({ message: 'we got a problem' });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (ex) {
    console.log("ex", ex);
  }
}

async function SendMailtobuyer(email, ordernum, proname) {
  try {
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
      subject: "Order Confirmation By SPARE BITS",
      html: `<h1>Hello! This is the Confirmation Email By Spare Bits for your order of ${proname}</h1>
                <h1>Your Order number is  # ${ordernum}  </h1>
                <h1>You will recieve your order in the next two working days </h1>
                <h2>Please Check the app for more details </h2>
                <p> Thanks a lot for using Spare Bits!   </p> 
                
                <h2>regards:</h2> <p>Spare Bits</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        //res.send({ message: 'we got a problem' });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (ex) {
    console.log("ex", ex);
  }
}

module.exports = ordersController;
