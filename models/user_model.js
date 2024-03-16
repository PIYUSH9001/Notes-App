const mongoose = require('mongoose');

const note_schema = mongoose.Schema({
    _id:false,
    title:{
        type:String,
    },
    content:{
        type:String,
    }
});

const user_schema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    notes:[note_schema],
});

const user_model = mongoose.model("users",user_schema);

module.exports = user_model;