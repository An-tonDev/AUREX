const express=require('express')
const morgan=require('morgan')
const app=express()
const userRouter=require('./User/user-routes')
const webhookRouter=require('./wallet/webhook-routes')
const walletRouter=require('./wallet/wallet-route')
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

app.use('/webhook/paystack',express.json({
    verify:(req,res,buf)=>{
        req.rawBody=buf
    }
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use('/api/v1/user',userRouter)
app.use('/api/v1/wallet',walletRouter)
app.use('/api/v1/webhook',webhookRouter)
app.use(errorHandler)

app.use(catchAllHandler)


module.exports= app