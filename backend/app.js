const express =   require('express')
const cookieParser = require('cookie-parser')
const app = express()


if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({path:"./config/config.env"})
}

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//Importing Routes
const post = require('./routes/post')
const user = require('./routes/user')


//Using Routes
/*app.use('/',(req,res)=>{
    res.send("Hello")
})*/
app.use("/api/v1",post)
app.use("/api/v1",user)



module.exports = app


