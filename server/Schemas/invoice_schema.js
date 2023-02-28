const mongoose = require('mongoose');


const Invoice=new mongoose.Schema({
    dueDate: {type:String},
    items: [ { itemName: String, unitPrice: String, quantity: String, discount: String } ],
    status: {type: String},
    invoiceNumber:{type: String},
    createdAt: {
        type:String
    },
    client: { name: String, email: String, phone: Number},
    owner: { type: String},
    totalAmount:{type: Number},
})

const model=mongoose.model('invoice',Invoice);
module.exports=model