const webhookController=require('./paystack-webhook-controller')
const express=require('express')

const Router=express.Router()

Router.route('/paystack',webhookController.paystackWebhook)


module.exports=Router