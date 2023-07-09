const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/UserModel");
const becrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie_parser = require('cookie-parser');


const salt = becrypt.genSaltSync(10);
const secretSalt = "haDHBHDE374OWHCAOBDCJA";

const app = express();
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookie_parser());

mongoose.connect(
  "mongodb+srv://ceadmin:hMUazkyKfJ9rEA1Q@cluster0.lgrvppr.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ username, password :becrypt.hashSync(password, salt)});
    res.json(newUser);
  } catch (error) {
    // console.log(`Error while registering user ${newUser}:`, error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const oldUser = await User.findOne({username});
    const oldUserPassOk = becrypt.compareSync(password, oldUser.password);
    res.json(oldUserPassOk);
    if(oldUserPassOk) {
        // create token
        jwt.sign({username, id:oldUser._id}, secretSalt, {}, (error, token)=>{
            if (error) throw error;
            res.cookie("token", token).json('ok');
        })
    }else res.status(400).json("user not found!");
  } catch (error) {
    console.log(`Error while registering user ${username}:`, error);
  }
});

app.get("/profile", (req, res)=>{
  const {token} = req.cookies;
  jwt.verify(token, secretSalt, {}, (error, info)=>{
    if(error) throw error
    res.json(info);
      
  })
  res.json(req.cookies);
})

app.listen(4000);

// hMUazkyKfJ9rEA1Q

// mongodb+srv://ceadmin:hMUazkyKfJ9rEA1Q@cluster0.lgrvppr.mongodb.net/?retryWrites=true&w=majority
