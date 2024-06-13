const { default: mongoose } = require('mongoose');


module.exports.UserSchema = new mongoose.Schema({
    firstName:{
      type: String,
      required: true
    },
    lastName:{
      type: String,
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase: true 
    },
    gender:{
      type: String,
      required: true,
    },
    job:{
      type: String,
    }
  }, ({timestamps: true}))