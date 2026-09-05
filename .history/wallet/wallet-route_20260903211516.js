const walletController=require('./wallet-controller')
const express=require('express')

const Router=express.Router()

Router.psot('/:id',walletController.addBalance)

module.exports=Router