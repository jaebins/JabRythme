const express = require("express");
const mysql = require("mysql")
const cors = require("cors")

const app = express();

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password:"1432",
    database: "JabRythme"
})

app.use(cors());

app.post("/loginProcess", (req, res) =>{
    db.query("SELECT * FROM users WHERE userID=? and userPW=?", [req.query.id, req.query.pw], (err, rs) => {
        if(err){
            res.send(err);
        }
        else{
            res.send(rs);
        }
    })
})

app.post("/registerProcess", (req, res) =>{
    db.query("INSERT INTO users(userID, userPW) VALUES (?, ?)", [req.query.id, req.query.pw], (err, rs) =>{
        if(err){
            res.send(err);
        }
        else{
            res.send("suc");
        }
    })
})

app.listen(8000, () =>{
    console.log("Server Open");
})
