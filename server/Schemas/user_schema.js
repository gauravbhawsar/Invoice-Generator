const mongoose = require('mongoose');


const User=new mongoose.Schema({
    firstName:{ type: String, required: true },
    email:{ type: String, required: true , unique: true},
    userName:{ type: String, required: true },
    password:{ type: String, required: true },
    lastName:{type: String, required: true }

})

const model=mongoose.model('user',User);
module.exports=model