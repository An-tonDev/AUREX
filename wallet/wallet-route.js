const walletController=require('./wallet-controller')
const express=require('express')

const Router=express.Router()

Router.post('/addbal/:id',walletController.addBalance)
Router.post('/withdraw/:id',walletController.withdrawal)

module.exports=Router