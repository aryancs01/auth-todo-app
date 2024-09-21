require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const cors = require("cors")
const express = require("express")
const jwt = require("jsonwebtoken")
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname + "/public"));
const users = []
let todos = []

app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = users.find((u)=>username === u.username && password === u.password);

    if(foundUser){
        res.json({
            msg:"You are already Signup!!"
        })
    }else{
        users.push({
            username:username,
            password:password
        })

        res.json({
            msg:"Signup Successfully"
        })
    }
})

app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = users.find((u)=>username === u.username && password === u.password);

    if(foundUser){
        const token = jwt.sign({
            username:username
        },jwtSecret)

        res.json({
            token:token
        })
    }else{
       res.json({
        msg:"Do Signup bruh!"
       })
    }
})

function auth(req,res,next){
    const token = req.headers.token;
    const decodeInfo = jwt.verify(token,jwtSecret);
    
    if(decodeInfo){
        req.username = decodeInfo.username;
        next()
    }else{
        res.json({
            msg:"Kch toh dikkat hai authentication mei!"
        })
    }
}

app.get("/todo",auth,function(req,res){
    res.send(__dirname+"/public/todo.html");
})

app.post("/addtodo",auth,function(req,res){
    const content = req.body.content;
    const id = req.body.id;

    todos.push({
        id:id,
        content:content
    })

    res.json({
        id:id,
        content:content
    })
})

app.get("/gettodo",auth,function(req,res){
    res.json(todos)
})

app.delete("/deletetodo",auth,function(req,res){
    let id = req.body.id;
    todos = todos.filter((u)=>u.id !== id)
    res.json(todos)
})

app.listen(3000)