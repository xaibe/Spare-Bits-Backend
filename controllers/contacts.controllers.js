/* eslint-disable no-unused-vars */
const contactsController = {};
const Orders = require("../models/orders.model");
const Contacts = require("../models/contacts.model");

//to send all the contacts to frontend

contactsController.getAll = async (req, res) => {
  let contacts;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    contacts = await Contacts.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: contacts,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//to delete selected contact

contactsController.deleteContact = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;

    const result = await Contacts.findOneAndDelete({
      roomid: _id,
    });
    if (result) {
      return res.status(200).send({
        code: 200,
        message: "Deleted Successfully",
      });
    } else {
      return res.status(500).send({ code: 500 });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//to create new contact
contactsController.createContact = async (req, res) => {
  let contacts;

  try {
    const body = req.body;
    const roomid1 = body.user_id + body.contacted_userid;
    const roomid2 = body.contacted_userid + body.user_id;

    console.log("contactbody", body);
    console.log("body rommid1", roomid1);
    console.log(" body roomid2", roomid2);

    const result1 = await Contacts.findOne({ roomid: roomid1 });

    console.log("result after finding new userid", result1);

    if (!result1) {
      const result2 = await Contacts.findOne({ roomid: roomid2 });
      console.log("result after finding new contacteduserid", result2);
      if (!result2) {
        contacts = new Contacts(body);

        const result = await contacts.save();

        console.log("contact created", result);

        if (result) {
          return res
            .send({ message: "Contact created successfully" })
            .status(200);
        } else {
          return res
            .send({ message: "Error", detail: result.error })
            .status(500);
        }
      }
      //else of result2
      else {
        return res
          .send({ message: "This contact has been already created" })
          .status(500);
      }
    }
    //else of result1
    else {
      return res
        .send({ message: "This contact has been already created" })
        .status(500);
    }
  } catch (ex) {
    return res.send({ message: "Error", detail: ex }).status(500);
  }
};

//to save new Messages
contactsController.updateMessages = async (req, res) => {
  let contact;
  const roomid = req.params._id;
  const body = req.body;
  console.log("room id", roomid);
  console.log("message body", body);
  console.log("message", body.msg);
  const result = await Contacts.findOne({ roomid: roomid });
  console.log("results", result);
  if (!result) {
    return res
      .send({ message: "Error! no room exists by this room id" })
      .status(500);
  } else {
    let obj = {
      message: body.msg,
    };
    console.log("results", result);
    if (body.user === result.user_name) {
      //then add messages to user_messages
      console.log("user_messages");

      try {
        contact = await Contacts.update(
          { roomid: roomid },
          {
            $push: {
              user_messages: obj,
            },
          }
        );
        return res
          .send({
            message: "message saved successfully",
          })
          .status(200);

        //res.status(200).end();
      } catch (ex) {
        console.log("ex", ex);
        if (ex.code === 11000) {
          return res
            .send({
              message: "This message is already created",
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
    } else if (body.user === result.contacteduser_name) {
      //then add messages to contacted user
      console.log("contacteduser_messages");
      try {
        contact = await Contacts.update(
          { roomid: roomid },
          {
            $push: {
              contacteduser_messages: obj,
            },
          }
        );
        return res
          .send({
            message: "message saved successfully",
          })
          .status(200);

        //res.status(200).end();
      } catch (ex) {
        console.log("ex", ex);
        if (ex.code === 11000) {
          return res
            .send({
              message: "This message has been already saved",
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
    }
  }
};

//update contact by contact id
async function runUpdate(_id, updates, res) {
  try {
    const result = await Contacts.updateOne(
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
//update contact by contact name
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

module.exports = contactsController;
