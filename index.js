const express = require('express');
const app = express();
const PORT = 8001;
const path = require('path');
const user_router = require('./routes/user_route');
const cookie_parser = require('cookie-parser');
const connect_DB = require('./connection/connection');
const {setNoCache} = require('./middlewares/middleware');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser());
app.use(setNoCache);


app.use("/",user_router);
app.use(express.static('./views'));
app.set("view engine","ejs");

connect_DB("mongodb://127.0.0.1:27017/usersDB").then(()=>{
    console.log("Database Connected!");
}).catch((error)=>{
    console.log(error);
});
app.set("views",path.resolve('./views'));

app.listen(PORT,()=>{
    console.log("Server started at http://127.0.0.1:" + PORT + "/login");
});