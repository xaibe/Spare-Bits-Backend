const storesController = {};
const Products = require("../models/products.model");
const Stores = require("../models/stores.model");
var fs = require("fs");
storesController.getAll = async (req, res) => {
  let stores;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    stores = await Stores.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: stores,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

storesController.filtered = async (req, res) => {
  const email = req.params.email;
  console.log("email", email);

  try {
    const store = await Stores.findOne({ email: email });
    console.log("stores", store);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      data: store,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

storesController.feedback = async (req, res) => {
  let feedback;

  const name = req.params.name;
  console.log("product name", name);

  const body = req.body;
  console.log("feedbackbody", body);

  body.forEach((element) => {
    feedback = element;
  });

  console.log("feedbackbody dupl", feedback);

  try {
    const stores = await Stores.find({ name: name });
    await Stores.updateOne(
      { name: name },
      {
        $push: {
          feedback: feedback,
          //{
          //              userId:ObjectId("570ca5e48dbe673802c2d035"),
          //              point: 10
          //             }
        },
      }
    );

    console.log("stores", stores);

    return res.status(200).send({
      code: 200,
      message: "Successful",
      //    data: stores
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

// try {
//       //const _id = req.params._id;

//        const updates = {
//         feedback:feedback
//        };
//        runUpdateByName(name, updates, res);
//      } catch (error) {
//        console.log('error', error);
//        return   res.status(500).send(error);

//        }

// } catch(error) {
//       console.log(error);
//       return res.send(400);

// }

// return res.status(200).send({
//   code: 200,
//   message: 'Successful',
//   //data: stores
// });
//   var host = req.headers;
//   console.log("headers",host);
//   try {

//    const files=req.files;
//    console.log("files",files);

//    files.forEach(element => {
//    Duplicate_url.push(element.originalname);

//   });

//   const mainImage = Duplicate_url.shift();
// console.log("main image",mainImage);

// files.forEach(element => {
//   console.log("name",element.originalname);
//   console.log("length",files.length);
//  image_url.push(element.originalname);
//   //myArray=element.originalname;

//   name=element.originalname;
// });

//    try {
//     //const _id = req.params._id;

//     const updates = {
//       mainimage:mainImage,
//       image_url: image_url

//     };
//     runUpdateByName(name, updates, res);
//   } catch (error) {
//     console.log('error', error);
//     return   res.status(500).send(error);

//     }

// } catch(error) {
//       console.log(error);
//       return res.send(400);

// }

storesController.uploadImage = async (req, res) => {
  const image_url = [];
  const Duplicate_url = [];
  var name;

  try {
    const files = req.files;
    console.log("files", files);

    files.forEach((element) => {
      Duplicate_url.push(element.originalname);
    });
    const mainImage = Duplicate_url.shift();
    //const mainImage2 = mainImage.replace(/\s/g, '').trim();

    console.log("main image", mainImage);
    // console.log("main image",mainImage2);

    files.forEach((element) => {
      console.log("name", element.originalname);
      console.log("length", files.length);
      image_url.push(element.originalname);
      //myArray=element.originalname;

      name = element.originalname;
    });

    console.log("name", name);
    var dot = ".";
    dot = name.indexOf(dot);
    console.log("dot", dot);
    name = name.slice(0, dot);

    console.log("name", name);
    console.log("image_url", image_url);

    try {
      //const _id = req.params._id;

      const updates = {
        mainimage: mainImage,
        image_url: image_url,
      };
      runUpdateByName(name, updates, res);
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error);
    }
  } catch (error) {
    console.log(error);
    return res.send(400);
  }
};
//   const files=req.file;
// console.log("files",files);
// if(!files){
//   const error= new Error('No File');
//   error.httpStatusCode=400
//   return next(error)
// }
// res.send({status: 'OK'});

//   try {
// const body=req.file;
// console.log('body',body);

// const ext = path.extname(req.file.originalname);
// const name=req.file.originalname;
// var email=req.file.originalname;

//   email = email.substring(14,email.length-5);
//   console.log('name',email);

//     const filePath =   name;
//     console.log('filepath',filePath);
//     console.log('extension',ext);

//     const updates = {
//       avatar: filePath,
//       avatar_ext: ext,
//       imageUrl:filePath
//     };
//     runUpdateById(email, updates, res);
//      //runUpdateById(req.params.id, updates, res);

//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
//};

storesController.getSingleStore = async (req, res) => {
  let store;
  try {
    const _id = req.params._id;
    store = await Stores.findOne({ _id: _id });
    console.log("store found", store);
    res.status(200).send({
      code: 200,
      message: "Successful find dtore",
      data: store,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

storesController.addStore = async (req, res) => {
  let stores;

  try {
    const body = req.body;

    stores = new Stores(body);

    const result = await stores.save();

    console.log("store created", result);

    return res
      .send({
        message: "store registered successfully",
      })
      .status(200);

    //res.status(200).end();
  } catch (ex) {
    console.log("ex", ex);
    if (ex.code === 11000) {
      return res
        .send({
          message: "This store has been registered already",
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

storesController.deleteStore = async (req, res) => {
  let result3;
  let result2;
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    const storeimg = await Stores.findOne({ _id: _id });
    for (let uri of storeimg.image_url) {
      let filepath = `Public/uploadstore/` + uri;
      console.log("filepath", filepath);
      fs.unlinkSync(filepath);
    }

    const result = await Stores.findOneAndDelete({
      _id: _id,
    });

    if (result != null) {
      result3 = await Products.find({ store_id: _id });
      console.log("Found products by product id", result3);
      for (let reslt of result3) {
        for (let uri of reslt.image_url) {
          let filepath = `Public/uploadproduct/` + uri;
          console.log("filepath", filepath);
          fs.unlinkSync(filepath);
        }
      }

      for (let reslt of result3) {
        const _id = reslt._id;
        console.log("Found single product by product id", reslt);

        result2 = await Products.findOneAndDelete({ _id: _id });
      }
      if (result2 != null) {
        res.status(200).send({
          code: 200,
          message: "Deleted Successfully",
        });
      } else {
        return res.status(200).send({
          code: 200,
          message: "Store delete but cant find any Product in store",
        });
      }
    } else {
      return res.status(500).send({
        code: 500,
        message: "Store could not be found",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

storesController.updateProduct = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Stores.updateOne(
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
    const result = await Stores.updateOne(
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
module.exports = storesController;
