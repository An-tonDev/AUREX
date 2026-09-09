const walletController=require('./wallet-controller')
const express=require('express')

const Router=express.Router()

Router.post('/add-bal/:id',walletController.addBalance)

module.exports=Router