const express=require('express')
const morgan=require('morgan')
const app=express()
const userRouter=require('./User/user-routes')
const errorHandler=require('./middleware/errorHandler')


if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

const catchAllHandler=(req,res)=>{
    return res.status(400).json({
        status:'error',
        message: `${req.originalUrl} not found on the server`
    })
}

app.use('webhook/paystack',express.json({
    verify:(req,res,buf)=>{
        req.rawBody=buf
    }
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/v1/user',userRouter)
app.use(errorHandler)

app.use(catchAllHandler)


module.exports= app