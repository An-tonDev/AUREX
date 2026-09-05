const webhookController=require('./paystack-webhook-controller')
const express=require('express')

const Router=express.Router()

Router.post('/paystack',webhookController.paystackWebhook)


module.exports=Router