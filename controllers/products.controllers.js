const productsController = {};
const Products = require('../models/products.model');
const fs = require('fs');
productsController.getAll = async (req, res) => {
  let products;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    products = await Products.paginate(
      merged,
      {
        offset: parseInt(start),
        limit: parseInt(length)
      }
    );
    return res.status(200).send({
      code: 200,
      message: 'Successful',
      data: products
    });
    
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

productsController.filtered = async (req, res) => {
  
  let products=[];
  const email = req.params.email;
    console.log("email",email);
  
  try {
   
    products = await Products.find({ email: email });
    console.log("products",products);

    return res.status(200).send({
      code: 200,
      message: 'Successful',
      data: products
    });
    
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
     
    }
};

productsController.filterbystore_id = async (req, res) => {
  
  let products=[];
  const _id = req.params._id;
    console.log("_id",_id);
  
  try {
   
    products = await Products.find({ store_id: _id });
    console.log("products",products);

    return res.status(200).send({
      code: 200,
      message: 'Successful',
      data: products
    });
    
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
     
    }
};

productsController.feedback = async (req, res) => {
  
  let feedback;

  const name = req.params.name;
    console.log("product name",name);
  
  const body=req.body;
console.log("feedbackbody",body);


    body.forEach(element => {
    feedback=element;    
   });

console.log("feedbackbody dupl",feedback);

try {
   
const products = await Products.find({ name: name });
await  Products.update(
    {  name: name},
    {
      $push: {
                "feedback": feedback
              //{
              //              userId:ObjectId("570ca5e48dbe673802c2d035"),
              //              point: 10
              //             }
              }
     }
  )
  
 
 
  console.log("products",products);

  return res.status(200).send({
    code: 200,
    message: 'Successful',
//    data: products
  });
  
} catch (error) {
  console.log('error', error);
  return res.status(500).send(error);
   
  }
};


productsController.uploadImage = async (req, res) => {
  const image_url=[];
  const Duplicate_url=[];
  var name;
  
  var host = req.headers; 
  console.log("headers",host);
  try {
    
   const files=req.files;
   console.log("files",files);
   
   files.forEach(element => {
   Duplicate_url.push(element.originalname);
    
  });

  const mainImage = Duplicate_url.shift();
console.log("main image",mainImage);
   

files.forEach(element => {
  console.log("name",element.originalname);
  console.log("length",files.length);
 image_url.push(element.originalname);
  //myArray=element.originalname;
 
  name=element.originalname;
});


console.log('name',name);
var dot='.';
dot=name.indexOf(dot);
console.log("dot",dot);
name=name.slice(0,dot);

  console.log('name',name);
   console.log("image_url",image_url);
   

   try {
    //const _id = req.params._id;
    
    const updates = {
      mainimage:mainImage,
      image_url: image_url
      
    };
    runUpdateByName(name, updates, res);
  } catch (error) {
    console.log('error', error);
    return   res.status(500).send(error);

    }
    
   


 
} catch(error) {
      console.log(error);
      return res.send(400);
       
}

};



productsController.getSingleProduct = async (req, res) => {
  let product;
  try {
    const _id = req.params._id;
    product = await Products.findOne({ _id: _id });
console.log("products filter by id", product);
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: product
      
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};


productsController.addProduct = async (req, res) => {
  let products;
  
    try {
      
    const body = req.body;



     products = new Products(body);

    const result = await products.save();

    console.log("product created",result);

  return res.send({
        message: 'product registered successfully',
      }).status(200);

//res.status(200).end();
    
  } catch (ex) {
    console.log('ex', ex);
    if(ex.code===11000){
      return res
      .send({
        message: 'This product has been registered already',
      })
      .status(500);
  
    }
    else {
      return res
      .send({
        message: 'Error',
        detail: ex
      })
      .status(500);
      
    }
  }
};

productsController.deleteProduct = async (req, res) => {
  if (!req.params._id) {
  
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;
 
    
    const result1 = await Products.findOne({_id: _id});
 for(let uri of result1.image_url)
{
  let filepath =   `Public/uploadproduct/`+uri;
  console.log("filepath",filepath);
    fs.unlinkSync(filepath); 
}
    

    const result = await Products.findOneAndDelete({
      _id: _id
    });
   if(result){
    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
   }
    
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

productsController.updateProduct = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Products.updateOne(
      {
        _id: _id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: 'Updated Successfully'
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: 'Created Successfully'
        });
      } else {
        res.status(422).send({
          code: 422,
          message: 'Unprocessible Entity'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}



async function runUpdateByName(name, updates, res) {
  try {
    const result = await Products.updateOne(
      {
        name: name
      },
      {
        $set: updates
      },
      {
        upsert:true,
        runValidators: true
      }
    );

    if (result.nModified == 1) {
      
      res.status(201).send({
        code: 201,
        message: 'Updated Successfully'
      });
    } else if (result.upserted) {
      res.status(203).send({
        code: 203,
        message: 'Created Successfully'
      });
    } else {
      {
        res.status(202).send({
          code: 202,
          message: 'Task completed successfully'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}
    module.exports = productsController;