const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
SECRET = "RESTAPI" // very long string combination/pattern of numbers, chars
var cors = require('cors')

PORT = 5000
const loginRoutes = require("./routes/login")
const userRoutes = require("./routes/users")
const postRoutes = require("./routes/posts")

const app = express(); // create a new express application

// mongoose.connect('mongodb://localhost:27017/assignment_5')
// mongoose.connect('mongodb+srv://meghna:11223344@cluster0.wpyvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://meghna:11223344@cluster0.wpyvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true }).then( () => console.log("MongoDB Connected")).catch( (err) => console.log("MongoDB error"))
//app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const whitelist =[
    "http://localhost:3000", "https://sheltered-crag-36688.herokuapp.com"
]
app.use(cors({
    origin:(origin,callback)=>{
        if (whitelist.indexOf(origin)!==-1||!origin){
            callback(null,true)
        }else{
            callback(new Error("Not allowed"))
        }
    },optionsSucsessStatus:200
}))



app.use("/posts",(req,res,next)=>{

    var token = req.headers.authorization.split("Bearer ")[1];
    if(!token){
        return res.status(401).json({
            status:"failed",
            message:"token is missing"
        })
    }
    jwt.verify(token,SECRET,function(err,decoded){  // jwt keeps a record of the tokens
        if(err){
            return res.status(401).json({
                status:"failed",
                message:"invalid token"
            })
        }
        else{
            req.user = decoded.data
            next();
        }
    })
})


app.use("/",loginRoutes)
app.use("/users",userRoutes)
app.use("/",postRoutes)


app.listen(PORT,()=>{  // bind the connections on this port and listen to it
    console.log(`example app listening on port ${PORT}`);
})







