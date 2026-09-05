const express=require('express')
const morgan=require('morgan')
const app=express()


if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

const catchAllHandler=(req,res)=>{
    return res.status(400).json({
        status:'error',
        message: `${req.originalUrl} not found on the server`
    })
}

app.use(express.json())
app.use(catchAllHandler)


module.exports= app