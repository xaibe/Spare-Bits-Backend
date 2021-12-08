const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Order = new Schema({
  id: {
    type: Number,
    unique: true,
    sparse: true,
  },
  orderbyemail: { type: String },
  Address: { type: String },
  mainimage: { type: String },
  Phonenumber: { type: Number },
  confirm: { type: Boolean },
  productid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cancelled: { type: Boolean },
  sellerName: { type: String },
  ordertoemail: { type: String },
  productname: { type: String },
  TotalAmount: { type: String },
  Delivered: { type: Boolean },
  productCount: { type: Number },
  paymentType: { type: String },
  discount: { type: Number },
  Date: { type: String },
  Time: { type: String },
});

Order.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", Order);
