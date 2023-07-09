const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username:{
        type: String,
        required : true,
        unique: true,
        minlength:[5,'Username should be at least 5 characters long'],
        maxlength:[20,"Username can't exceed more than 20 character"]

    },
    password:{
        type:String,
        required:true,
        
    }
});

const userModel = model('User', UserSchema);

module.exports = userModel;